import os
import json
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SAKSHAM VOICE - Multi-Agent Backend",
    description="Agentic AI API for Multilingual Voice Livelihood Mapping & NSQF Skilling Recommendation",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY", os.getenv("GEMINI_API_KEY", ""))
GROQ_API_KEY = os.getenv("VITE_GROK_API_KEY", os.getenv("GROQ_API_KEY", ""))

class ChatTurn(BaseModel):
    speaker: str
    text: str

class ChatRequest(BaseModel):
    user_input: str
    language: str = "kn"
    history: List[ChatTurn] = []
    current_slots: Optional[Dict[str, Any]] = None

class SkillMappingRequest(BaseModel):
    occupation: str
    experience_years: int
    tools: List[str]
    aspiration: str
    language: str = "kn"

@app.get("/")
def root():
    return {
        "service": "SAKSHAM VOICE Agentic Backend",
        "status": "online",
        "track": "Perception, Voice & Document Reasoning Agents",
        "supported_models": ["gemini-2.5-flash", "whisper-large-v3-turbo", "groq-qwen3.8-27b"]
    }

@app.post("/api/speech-to-text")
async def speech_to_text(file: UploadFile = File(...), language: str = Form("kn")):
    """
    Speech-to-Text using Groq Whisper Large v3 Turbo
    """
    if not GROQ_API_KEY:
        raise HTTPException(status_code=400, detail="GROQ_API_KEY is not configured for Whisper STT")

    contents = await file.read()
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        files = {"file": (file.filename or "audio.wav", contents, file.content_type or "audio/wav")}
        data = {
            "model": "whisper-large-v3-turbo",
            "language": language
        }
        headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
        
        res = await client.post(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            files=files,
            data=data,
            headers=headers
        )
        
        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail=res.text)
            
        return res.json()

@app.post("/api/chat")
async def chat_agent(req: ChatRequest):
    """
    LLM-based multi-turn conversational agent with intent recognition and slot extraction
    """
    system_prompt = f"""
You are SAKSHAM VOICE (ಸಕ್ಷಮ್ ವಾಯ್ಸ್), a national-grade Agentic AI for rural & informal livelihood skilling in India.
Current Target Language: "{req.language}". Respond strictly in "{req.language}".

RULES:
1. GREETINGS: If user greets (Good morning, Hello, Namaskara), greet back warmly and ask about their trade/occupation.
2. IDENTITY: If user asks who you are or your name, introduce yourself as Saksham Voice.
3. SLOTS: Extract occupation, experienceYears, toolsEquipment, and aspiration without repeating questions for known slots.
4. READBACK: When all 4 slots are known, formulate spoken read-back recap asking for confirmation (YES/NO).

Respond in JSON with schema:
{{
  "intent": "GREETING" | "IDENTITY" | "OFF_TOPIC" | "SLOT_UPDATE" | "READBACK",
  "extractedOccupation": string or null,
  "extractedExperienceYears": number or null,
  "extractedTools": string or null,
  "extractedAspiration": string or null,
  "isReadyForReadback": boolean,
  "spokenText": string (in "{req.language}"),
  "englishTranslation": string,
  "reasoningObservation": string,
  "reasoningDecision": string,
  "confidence": number
}}
"""

    # If Gemini is configured
    if GEMINI_API_KEY:
        async with httpx.AsyncClient(timeout=20.0) as client:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}"
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"System:\n{system_prompt}\n\nContext History:\n{[t.dict() for t in req.history[-4:]]}\n\nKnown Slots:\n{req.current_slots}\n\nCitizen Input: '{req.user_input}'"
                    }]
                }],
                "generationConfig": {"responseMimeType": "application/json"}
            }
            res = await client.post(url, json=payload)
            if res.status_code == 200:
                data = res.json()
                text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "{}")
                return json.loads(text)

    # Fallback to Groq Cloud LLM
    if GROQ_API_KEY:
        async with httpx.AsyncClient(timeout=20.0) as client:
            messages = [
                {"role": "system", "content": system_prompt},
                *[{"role": "user" if t.speaker == "user" else "assistant", "content": t.text} for t in req.history[-4:]],
                {"role": "user", "content": req.user_input}
            ]
            res = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                json={
                    "model": "qwen/qwen3.8-27b",
                    "messages": messages,
                    "response_format": {"type": "json_object"}
                }
            )
            if res.status_code == 200:
                content = res.json()["choices"][0]["message"]["content"]
                return json.loads(content)

    return {
        "intent": "SLOT_UPDATE",
        "spokenText": "Thank you for sharing. What tools do you use in your daily work?",
        "englishTranslation": "Thank you. What tools do you use?",
        "isReadyForReadback": False,
        "confidence": 95
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
