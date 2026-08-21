import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint

load_dotenv()
hf_token = os.getenv("HF_TOKEN")

app = FastAPI(title="AI LangChain Microservice", version="1.0.0")

try:
    llm = HuggingFaceEndpoint(
        repo_id="mistralai/Mistral-7B-Instruct-v0.3",
        task="text-generation",
        max_new_tokens=250,
        temperature=0.7,
        huggingfacehub_api_token=hf_token,
    )
except Exception as e:
    print(f"Error initializing Hugging Face Model: {e}")
    llm = None

class QueryRequest(BaseModel):
    prompt: str

@app.post("/api/generate")
async def generate_text(request: QueryRequest):
    if not llm:
        raise HTTPException(status_code=500, detail="LLM service is currently unavailable.")
    
    try:
        
        response = llm.invoke(request.prompt)
        return {"success": True, "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": "Mistral-7B"}
