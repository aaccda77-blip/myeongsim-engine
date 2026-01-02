import os
import shutil
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader, Docx2txtLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db")

def ingest_documents():
    # 1. Clear existing DB
    if os.path.exists(DB_PATH):
        try:
            shutil.rmtree(DB_PATH)
            print(f"Removed existing DB at {DB_PATH}")
        except Exception as e:
            print(f"Error removing DB: {e}")

    # 2. Load PDFs
    documents = []
    
    # Supported extensions and their loaders
    loaders = {
        ".pdf": PyPDFLoader,
        ".docx": Docx2txtLoader,
        ".txt": TextLoader
    }

    print(f"Scanning {DATA_PATH}...")
    
    for filename in os.listdir(DATA_PATH):
        file_path = os.path.join(DATA_PATH, filename)
        if not os.path.isfile(file_path):
            continue
            
        ext = os.path.splitext(filename)[1].lower()
        
        if ext in loaders:
            try:
                print(f"Loading {filename}...")
                loader_cls = loaders[ext]
                # TextLoader needs encoding sometimes
                if ext == ".txt":
                    loader = loader_cls(file_path, encoding="utf-8")
                else:
                    loader = loader_cls(file_path)
                    
                docs = loader.load()
                documents.extend(docs)
                print(f"✅ Loaded {len(docs)} pages/sections from {filename}")
            except Exception as e:
                print(f"❌ Failed to load {filename}: {e}")
        else:
            print(f"⚠️  Skipping unsupported file: {filename}")

    if not documents:
        return "No supported documents found in data/ folder."

    print(f"Loaded {len(documents)} documents.")

    # 3. Split Text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.")

    # 4. Embed and Store
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    # Create Chroma DB
    Chroma.from_documents(
        documents=chunks, 
        embedding=embeddings, 
        persist_directory=DB_PATH
    )
    
    return f"Successfully ingested {len(documents)} PDFs into {len(chunks)} chunks."

if __name__ == "__main__":
    print(ingest_documents())
