import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai
import chromadb
import bcrypt
import uuid

# Modules
from ingestion.docEmbed import process_and_embed_document
from ingestion.imageEmbed import process_and_embed_image
from rag_core.retrieval import get_rag_answer
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from firebaseconfig import db, user_collection


app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     origins=["http://localhost:5173"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Content-Type"])


from dotenv import load_dotenv
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


if not GOOGLE_API_KEY:
    print("Error : GOOGLE_API_KEY environment variable not set. Please set it.")

# Initialize Gemini Models & ChromaDB
try:
    genai.configure(api_key=GOOGLE_API_KEY)
    
    
    embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
    vision_model = genai.GenerativeModel('gemini-2.5-flash')
    text_generation_model = genai.GenerativeModel('gemini-2.5-flash')
    
    # ChromaDB Client
    chroma_client = chromadb.PersistentClient(path="./chroma_db_mvp")
    
    # Collection Name
    HARDCODED_COLLECTION_NAME = "default_brain"
    
    print("✅ Initialized Gemini Models and ChromaDB Client.")
except Exception as e:
    print(f"❌ Error during initialization: {e}")



# Testing route : A simple route to check if the backend is running
@app.route('/api/test', methods=['GET'])
def test_route():
    """A simple route to check if the server is running."""
    return jsonify({"message": "Glimpse backend is up and running!"})


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handles single or multiple file uploads, processes them, and stores them in the default brain."""
    import time
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # --- The "Traffic Cop" logic ---
    filename = secure_filename(file.filename)
    # Create a temporary folder for uploads if it doesn't exist
    os.makedirs("./temp_uploads", exist_ok=True)
    temp_path = os.path.join("./temp_uploads", filename)
    file.save(temp_path)
    
    file_ext = os.path.splitext(filename)[1].lower()
    image_extensions = ['.png', '.jpg', '.jpeg']
    doc_extensions = ['.pdf', '.docx', '.txt']
    success = False
    error_message = None
    
    try:
        if file_ext in image_extensions:
            # Delegate to the image processing module
            success = process_and_embed_image(
                file_path=temp_path,
                collection_name=HARDCODED_COLLECTION_NAME,
                chroma_client=chroma_client,
                embedding_model=embedding_model,
                vision_model=vision_model
            )
        elif file_ext in doc_extensions:
            # Delegate to the document processing module
            success = process_and_embed_document(
                file_path=temp_path,
                collection_name=HARDCODED_COLLECTION_NAME,
                chroma_client=chroma_client,
                embedding_model=embedding_model
            )
        else:
            error_message = f"Unsupported file type: {file_ext}"
            return jsonify({"error": error_message}), 400
    except Exception as e:
        print(f"❌ Error processing {filename}: {str(e)}")
        error_message = str(e)
        success = False
    finally:
        # Clean up the temporary file after processing
        # Give a small delay to ensure all file handles are released (Windows issue)
        time.sleep(0.2)
        
        max_attempts = 3
        for attempt in range(max_attempts):
            try:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                    print(f" - Temporary file '{filename}' removed successfully.")
                break
            except PermissionError as pe:
                if attempt < max_attempts - 1:
                    print(f" - File locked, retrying deletion... (attempt {attempt + 1})")
                    time.sleep(0.5)
                else:
                    print(f" - Warning: Could not delete temporary file '{temp_path}': {pe}")
                    # Continue anyway - file will be cleaned up later
            except Exception as e:
                print(f" - Error deleting temporary file: {e}")
                break

    if success:
        return jsonify({
            "message": f"File '{filename}' processed successfully.",
            "filename": filename,
            "status": "success"
        }), 200
    else:
        return jsonify({
            "error": error_message or f"Failed to process file '{filename}'.",
            "filename": filename,
            "status": "failed"
        }), 500


@app.route('/api/upload-batch', methods=['POST'])
def upload_batch():
    """Handles multiple file uploads in a single request."""
    import time
    
    if 'files' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400
    
    files = request.files.getlist('files')
    if not files or len(files) == 0:
        return jsonify({"error": "No files selected"}), 400
    
    results = []
    successful_uploads = 0
    failed_uploads = 0
    
    # Create temporary folder for uploads if it doesn't exist
    os.makedirs("./temp_uploads", exist_ok=True)
    
    image_extensions = ['.png', '.jpg', '.jpeg']
    doc_extensions = ['.pdf', '.docx', '.txt']
    
    for file in files:
        if file.filename == '':
            continue
            
        filename = secure_filename(file.filename)
        temp_path = os.path.join("./temp_uploads", filename)
        file_ext = os.path.splitext(filename)[1].lower()
        
        try:
            file.save(temp_path)
            success = False
            
            if file_ext in image_extensions:
                # Process image
                success = process_and_embed_image(
                    file_path=temp_path,
                    collection_name=HARDCODED_COLLECTION_NAME,
                    chroma_client=chroma_client,
                    embedding_model=embedding_model,
                    vision_model=vision_model
                )
            elif file_ext in doc_extensions:
                # Process document
                success = process_and_embed_document(
                    file_path=temp_path,
                    collection_name=HARDCODED_COLLECTION_NAME,
                    chroma_client=chroma_client,
                    embedding_model=embedding_model
                )
            else:
                results.append({
                    "filename": filename,
                    "status": "failed",
                    "error": f"Unsupported file type: {file_ext}"
                })
                failed_uploads += 1
                continue
            
            if success:
                results.append({
                    "filename": filename,
                    "status": "success",
                    "message": f"File '{filename}' processed successfully."
                })
                successful_uploads += 1
            else:
                results.append({
                    "filename": filename,
                    "status": "failed",
                    "error": f"Failed to process '{filename}'"
                })
                failed_uploads += 1
                
        except Exception as e:
            print(f"❌ Error processing {filename}: {str(e)}")
            results.append({
                "filename": filename,
                "status": "failed",
                "error": str(e)
            })
            failed_uploads += 1
        finally:
            # Clean up temporary file with retry logic for Windows file locks
            time.sleep(0.2)
            
            max_attempts = 3
            for attempt in range(max_attempts):
                try:
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                        print(f" - Temporary file '{filename}' removed successfully.")
                    break
                except PermissionError as pe:
                    if attempt < max_attempts - 1:
                        print(f" - File locked, retrying deletion... (attempt {attempt + 1})\")")
                        time.sleep(0.5)
                    else:
                        print(f" - Warning: Could not delete temporary file '{temp_path}': {pe}")
                except Exception as e:
                    print(f" - Error deleting temporary file: {e}")
                    break
    
    return jsonify({
        "message": f"Processed {successful_uploads} files successfully, {failed_uploads} failed.",
        "total": len(files),
        "successful": successful_uploads,
        "failed": failed_uploads,
        "results": results
    }), 200 if failed_uploads == 0 else 207  # 207 = Multi-Status


@app.route('/api/query', methods=['POST'])
def handle_query():
    """Handles user queries and returns a RAG-generated answer."""
    data = request.get_json()
    query_text = data.get('query')
    
    if not query_text:
        return jsonify({"error": "Missing query text"}), 400
            
    # Delegate the entire RAG process to the retrieval module
    answer = get_rag_answer(
        query=query_text,
        collection_name=HARDCODED_COLLECTION_NAME,
        chroma_client=chroma_client,
        embedding_model=embedding_model,
        text_generation_model=text_generation_model
    )
    
    return jsonify({"answer": answer})


@app.route('/register')
def register():
    data = request.get_json()
    name = data.get("username")
    usermail = data.get("usermail")
    password = data.get("password")

    if not name or not usermail or not password:
        return jsonify({"message": "Missing Feilds"}), 400
    
    existing_user = user_collection.where("usermail", "==", usermail).stream()

    if next(existing_user, None):
        return jsonify({"message": "User already exists"}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user_id = str(uuid.uuid4())
    user_collection.document.set({
        "user_id": new_user_id,
        "name": name,
        "usermail": usermail,
        "password": hashed_password.decode('utf-8')
    })

    return jsonify({"message": "User registered successfully"}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    usermail = data.get("usermail")
    password = data.get("password")

    email_query = user_collection.where("usermail", "==", usermail).stream()
    user_doc = next(email_query, None)

    if user_doc is None:
        return jsonify({"message": "User not registered"}), 404

    user_data = user_doc.to_dict()
    
    # Get the hashed password from Firestore and check it
    stored_password = user_data.get("password", "").encode('utf-8')
    if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
        return jsonify({"message": "Invalid credentials"}), 401

    telegram_id = user_data.get("telegramID", "")
    first_login = telegram_id.strip() == ""

    # Store user data in session
    session.permanent = True
    session["user_id"] = user_data.get("user_id")
    session["usermail"] = usermail
    session["username"] = user_data.get("name")
    session["telegram"] = user_data.get("telegramID")
    session.modified = True

    return jsonify({
        "message": "Login successful",
        "first_login": first_login
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)