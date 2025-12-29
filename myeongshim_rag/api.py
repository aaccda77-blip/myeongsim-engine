from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.ingest import ingest_documents
from src.rag_chain import MyeongshimBrain
import uvicorn

app = FastAPI(title="Myeongshim RAG server")

# Global Brain Instance
brain = MyeongshimBrain()

class QueryRequest(BaseModel):
    question: str
    saju: dict = None

@app.on_event("startup")
async def startup_event():
    print("Server starting up...")
    # Brain is already initialized globally, but we can re-check here if needed

@app.post("/ingest")
async def ingest_endpoint():
    """
    Triggers PDF ingestion and reloading of the RAG brain.
    """
    try:
        result = ingest_documents()
        brain.reload() # Reload the chain with new DB
        return {"status": "success", "message": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_endpoint(request: QueryRequest):
    """
    Asks the RAG agent a question.
    """
    try:
        response = brain.get_answer(request.question, request.saju)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
