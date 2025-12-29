import os
import shutil
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
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
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
        return "Data directory created. Please put PDF files in 'data/' folder."

    loader = DirectoryLoader(DATA_PATH, glob="*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()

    if not documents:
        return "No PDF documents found in data/ folder."

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
