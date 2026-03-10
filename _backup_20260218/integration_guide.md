# ☯️ Myeongshim Coaching Integration Guide

This guide describes how the Frontend (Next.js) and Backend (Python RAG) are integrated and how to run them.

## 🏗️ Architecture

The system consists of two main components, now fully unified:

1.  **Frontend ("Body")**: Next.js App (`src/`)
    *   **Port**: 3000
    *   **Role**: UI, Auth, Session Management, Direct Chat Logic.
    *   **Integration**: Calls the RAG server via `PromptEngine.ts` -> `fetch(RAG_SERVER_URL)`.

2.  **Backend ("Brain")**: Python FastAPI (`myeongshim_rag/`)
    *   **Port**: 8000
    *   **Role**: Vector Database (ChromaDB), Document Ingestion (PDF, DOCX, TXT), Deep Reasoning.
    *   **Entry Point**: `myeongshim_rag/api.py`.
    *   **Data**: All source documents are now in `myeongshim_rag/data/`.

## 🚀 How to Run (Recommended)

We have created a unified launcher script `main.py` in the root directory.

1.  **Prerequisites**:
    *   Python 3.10+ (and `venv` setup in `myeongshim_rag/venv`)
    *   Node.js 18+
    *   `.env.local` containing `GEMINI_API_KEY` and `SUPABASE_URL`.

2.  **Command**:
    ```bash
    python main.py
    ```

    This command will:
    *   Check for `RAG_SERVER_URL` in your env.
    *   **Auto-Check RAG DB**: If the vector database is missing, it will automatically ingest files from `myeongshim_rag/data`.
    *   Start the FastAPI Backend on Port 8000.
    *   Start the Next.js Frontend on Port 3000.
    *   Stream logs from both to your terminal.

## 🧪 Verification

Once running, verify the connection:

1.  Open [http://localhost:3000](http://localhost:3000).
2.  Start a chat.
3.  Type `/test_rag`.
    *   **Success**: The bot replies successfully with data fetched from the backend.
    *   **Failure**: "RAG Connection Failed". Check if port 8000 is blocked or if the python process crashed.

## 🛠️ Manual Setup Details

If you need to run them manually:

### Frontend
```bash
# Terminal 1
npm run dev
```

### Backend
```bash
# Terminal 2
cd myeongshim_rag
# Activate venv
venv\Scripts\activate  # Windows
source venv/bin/activate # Mac/Linux

# Install Dependencies (First time only)
pip install -r requirements.txt

# Run Server
python -m uvicorn api:app --reload --port 8000
```
