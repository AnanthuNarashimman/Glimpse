# Cell 2: Main Application (with Automatic Retries)

# --- SECTION 1: IMPORTS AND SETUP ---
import os
import google.generativeai as genai
from google.colab import userdata
from google.colab import files
from google.colab import drive
from PIL import Image
import json
import chromadb
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.docstore.document import Document
import time
print("✅ All libraries imported.")


# --- SECTION 2: SETUP (DRIVE, API KEY, MODELS, DB) ---
print("\n--- Setting up your environment ---")

# Configure the Gemini API Key
try:
    GOOGLE_API_KEY = userdata.get('GOOGLE_API_KEY')
    genai.configure(api_key=GOOGLE_API_KEY)
    print("✅ Gemini API key configured successfully!")
except Exception as e:
    print("❌ Could not configure Gemini API. Please add your API key as a Colab secret.")

# Initialize Gemini Models
try:
    vision_model = genai.GenerativeModel('models/gemini-2.5-flash')
    embedding_model = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=GOOGLE_API_KEY
    )
    print("✅ Gemini models ready.")
except Exception as e:
    print(f"❌ Error initializing Gemini models: {e}")

# Configure Database Path - Use local storage for ChromaDB
# (Google Drive has I/O issues with ChromaDB's locking mechanism)
CHROMA_DB_PATH = "/content/chroma_db_gemini"
os.makedirs(CHROMA_DB_PATH, exist_ok=True)
print("✅ Using local storage for ChromaDB (data will persist during this session).")

# Initialize ChromaDB
CHROMA_COLLECTION_NAME = "gemini_smart_collection"
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
chroma_collection = chroma_client.get_or_create_collection(name=CHROMA_COLLECTION_NAME)
print(f"✅ ChromaDB ready. Current items in collection: {chroma_collection.count()}")


# --- SECTION 3: CORE FUNCTION DEFINITIONS (UPGRADED) ---
def analyze_image_with_gemini(image_path: str) -> dict:
    """
    Analyzes an image with Gemini, with automatic retries for rate limit errors.
    """
    img = Image.open(image_path)
    prompt = """
    Analyze the image and respond in a JSON format.
    First, determine if the image is primarily a scenic photograph/portrait OR a document/screenshot containing a significant amount of text.
    - If it is a photograph, set the 'type' key to 'photograph' and the 'content' key to a short, descriptive caption.
    - If it is a document or screenshot, set the 'type' key to 'document' and the 'content' key to all the text you can extract from it, verbatim.
    Your entire response must be only the JSON object.
    """

    # --- RETRY LOGIC ---
    max_retries = 3
    delay = 5  # Start with a 5-second delay
    for attempt in range(max_retries):
        try:
            response = vision_model.generate_content([prompt, img])
            response_text = response.text.strip()

            # Debug: Print raw response
            print(f"  - Raw Gemini response: {response_text[:200]}...")

            # Try to extract JSON if wrapped in markdown code blocks
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()

            return json.loads(response_text)
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {e}")
            print(f"   Response was: {response_text[:500]}")
            return None
        except Exception as e:
            # Check if the error is a rate limit error (usually a 429 code)
            if "429" in str(e):
                print(f"   - Rate limit hit. Retrying in {delay} seconds... (Attempt {attempt + 1}/{max_retries})")
                time.sleep(delay)
                delay *= 2  # Double the delay for the next attempt (exponential backoff)
            else:
                # If it's a different error, report it and stop
                print(f"❌ An unexpected error occurred during Gemini analysis: {e}")
                return None

    print(f"❌ Failed to get a response after {max_retries} attempts.")
    return None

# (In SECTION 3)
def ingest_image_with_gemini(image_path: str):
    """Full pipeline: Analyzes an image with Gemini and stores the result in ChromaDB."""
    print(f"\n--- Ingesting image: {image_path} ---")
    analysis_result = analyze_image_with_gemini(image_path)
    if not analysis_result or not analysis_result.get('content'):
        print(f"⚠️ Skipping '{image_path}' due to analysis failure or empty content.")
        return
        
    content_type = analysis_result.get('type', 'unknown')
    content_text = analysis_result.get('content')
    
    print(f"  - Gemini identified type: '{content_type}'")
    print(f"  - Content to be stored: '{content_text[:100]}...'")
    
    embedding = embedding_model.embed_query(content_text)
    
    # --- CHANGE: ADD content_text TO METADATA FOR RELIABLE FILTERING ---
    metadata = {
        "source": image_path, 
        "type": content_type,
        "full_text": content_text  # Add the full content here for filtering
    }
    
    chroma_collection.add(
        ids=[image_path],
        embeddings=[embedding],
        documents=[content_text], # The document is still the primary content for semantic search
        metadatas=[metadata]      # The metadata now includes the text for filtering
    )
    print(f"  - Successfully stored embedding in ChromaDB.")
# (This function replaces the old query_images function)
# (In SECTION 3)
def advanced_query_images(query_text: str, n_results: int = 3):
    """
    Queries ChromaDB using a combination of vector search and metadata filtering.
    """
    print(f"\n--- Querying for: '{query_text}' ---")
    if chroma_collection.count() == 0:
        print("⚠️ The database is empty. Please ingest some images first.")
        return

    import re
    where_clause = {}
    main_query = query_text

    type_match = re.search(r'type:"(.*?)"', query_text)
    if type_match:
        doc_type = type_match.group(1)
        where_clause['type'] = doc_type
        main_query = re.sub(r'type:"(.*?)"', '', main_query).strip()
        print(f"  - Filtering by type: '{doc_type}'")

    text_match = re.search(r'text:"(.*?)"', query_text)
    if text_match:
        keyword = text_match.group(1)
        # --- CHANGE: Filter on the 'full_text' metadata field ---
        where_clause['full_text'] = {"$contains": keyword}
        main_query = re.sub(r'text:"(.*?)"', '', main_query).strip()
        print(f"  - Filtering by text containing: '{keyword}'")

    if not main_query:
        main_query = "find relevant images" 
    print(f"  - Performing semantic search on: '{main_query}'")

    query_embedding = embedding_model.embed_query(main_query)
    
    # --- FIX: ONLY PASS 'where' IF FILTERS EXIST ---
    if where_clause:
        results = chroma_collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where_clause  # Apply filter only when it's not empty
        )
    else:
        # Perform a query without the 'where' clause if no filters are specified
        results = chroma_collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )

    # (The rest of the function remains the same)
    if not results or not results.get('ids') or not results['ids'][0]:
        print("No results found for this criteria.")
        return

    print(f"✅ Found {len(results['ids'][0])} results:")
    for i, doc_id in enumerate(results['ids'][0]):
        distance = results['distances'][0][i]
        content = results['documents'][0][i]
        metadata = results['metadatas'][0][i]

        print(f"\n  Result {i+1}:")
        print(f"    - Image Path (ID): {doc_id}")
        print(f"    - Similarity Score (Distance): {distance:.4f} (Lower is better)")
        print(f"    - Stored Content: '{content[:150]}...'")
        print(f"    - Identified Type: {metadata.get('type', 'N/A')}")

# --- SECTION 4: INGESTION ---
print("\n--- Starting Smart Ingestion Process ---")
print("👇 Please upload the image(s) you want to process.")
uploaded_files = files.upload()
if not uploaded_files:
    print("⚠️ No files uploaded. Skipping ingestion.")
else:
    print(f"\n✅ Received {len(uploaded_files)} file(s). Processing...")
    processed_files = []
    for filename, content in uploaded_files.items():
        # Sanitize filename to be a valid path
        safe_filename = filename.replace(" ", "_")
        if safe_filename != filename:
            os.rename(filename, safe_filename)
        
        with open(safe_filename, 'wb') as f:
            f.write(content)
        ingest_image_with_gemini(safe_filename)
        processed_files.append(safe_filename)

    print(f"\n--- Ingestion Summary ---")
    print(f"✅ Total items now in ChromaDB: {chroma_collection.count()}")
    print("\n🧹 Cleaning up temporary files...")
    for f_path in processed_files:
        os.remove(f_path)
    print("🧹 Cleanup complete.")

# --- SECTION 5: ADVANCED QUERYING ---
print("\n\n--- Starting Advanced Query Interface ---")
print("You can now use filters in your search.")
print('Examples: ')
print('  - A photo of a dog')
print('  - type:"document" a python error')
print('  - text:"import os" screenshots of code')

while True:
    print("\nEnter a search query (or type 'exit' to quit):")
    user_query = input("> ")
    if user_query.lower() == 'exit':
        break
    if not user_query.strip():
        print("Please enter a valid query.")
        continue
    # Call the new advanced query function
    advanced_query_images(query_text=user_query, n_results=3)

print("\n✅ Session finished.")