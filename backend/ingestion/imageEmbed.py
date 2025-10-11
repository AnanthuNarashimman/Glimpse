import os
import json
from PIL import Image
import time


from langchain_community.vectorstores import Chroma
from langchain.docstore.document import Document


"""
Analyzes an image file, creates an embedding from its content,
and stores it in a specified ChromaDB collection.
"""

# Gets the content of the image, embeds it and stores it in vector database

def process_and_embed_image(file_path: str, collection_name: str, chroma_client, embedding_model, vision_model):

    print(f"\n--- Ingesting image: {file_path} ---")

    analysis_result = _analyze_image_with_gemini(file_path, vision_model)

    if not analysis_result or not analysis_result.get('content'):
        print(f" Skipping '{file_path}' due to analysis failure or empty content.")
        return False
    
    content_type = analysis_result.get('type', 'image')
    content_text = analysis_result.get('content')
    print(f" Gemini Identified type: '{content_type}'")

    document = Document(
        page_content=content_text,
        metadata={
            "source": os.path.basename(file_path),
            "type": content_type
        }
    )

    try:
        print(f" - Storing embedding for '{file_path}' in collection '{collection_name}'")
        Chroma.from_documents(
            documents=[document],
            embedding=embedding_model,
            collection_name=collection_name,
            client=chroma_client
        )

        print(f" - Successfully stored embedding in ChromaDB.")
        return True
    
    except Exception as e:
        print(f" - Error storing document in ChromaDB: {e}")



# Analyzes the image with help of gemini 

def _analyze_image_with_gemini(image_path: str, vision_model) -> dict:

    img = None
    try:
        img = Image.open(image_path)
    except Exception as e:
        print(f" - Could not open image: {e}")
        return None

    try:
        prompt = """
        Analyze the image and respond in a JSON format.
        - If it is a photograph/illustration, set 'type' to 'photograph' and 'content' to a descriptive caption.
        - If it is a document/screenshot, set 'type' to 'document' and 'content' to all extracted text.
        Your entire response must be only the JSON object.
        """

        max_retries = 3
        delay = 5

        for attempt in range(max_retries):
            try:
                response = vision_model.generate_content([prompt, img])
                response_text = response.text.strip()

                if "```json" in response_text:
                    response_text = response_text.split("```json")[1].split("```")[0].strip()

                result = json.loads(response_text)
                return result
            
            except json.JSONDecodeError:
                print(f" - JSON parsing error. Raw response: {response_text[:200]}...")
                return None
            
            except Exception as e:
                if "429" in str(e):
                    print(f" - Rate limit hit. Retrying in {delay}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(delay)
                    delay*=2

                else:
                    print(f" - An unexpected error occured during analysis: {e}")
                    return None
                
        print(f" - Failed to get a response after {max_retries} attempts.")
        return None
    
    finally:
        # Always close the image to release file handle
        if img is not None:
            img.close()
            print(" - Image file handle closed.")