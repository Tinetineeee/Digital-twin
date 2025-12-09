"""
Digital Twin RAG Application
Upstash Vector + Groq integration
"""

import os
import json
from dotenv import load_dotenv # pyright: ignore[reportMissingImports]
from upstash_vector import Index # pyright: ignore[reportMissingImports]
from groq import Groq # pyright: ignore[reportMissingImports]

load_dotenv()

JSON_FILE = "digitaltwin.json"
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
DEFAULT_MODEL = "llama-3.1-8b-instant"

def setup_groq_client():
    """Setup Groq client"""
    if not GROQ_API_KEY:
        print("GROQ_API_KEY not found in .env file")
        return None
    
    try:
        client = Groq(api_key=GROQ_API_KEY)
        print("Groq client initialized!")
        return client
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def load_profile_data():
    """Load profile from JSON"""
    try:
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading profile: {str(e)}")
        return None

def create_content_chunks(profile_data):
    """Convert profile into chunks"""
    chunks = []
    
    if "personal" in profile_data:
        personal = profile_data["personal"]
        chunks.append({
            "id": "summary",
            "title": "Professional Summary",
            "content": personal.get("summary", ""),
            "type": "personal"
        })
    
    if "skills" in profile_data:
        skills = profile_data["skills"]
        if "technical" in skills:
            tech = skills["technical"]
            if "design_specialties" in tech:
                chunks.append({
                    "id": "design",
                    "title": "Design Specialties",
                    "content": ", ".join(tech["design_specialties"]),
                    "type": "skills"
                })
    
    if "education" in profile_data:
        edu = profile_data["education"]
        chunks.append({
            "id": "education",
            "title": "Education",
            "content": f"{edu.get('degree', '')} from {edu.get('university', '')}",
            "type": "education"
        })
    
    if "projects_portfolio" in profile_data:
        for idx, proj in enumerate(profile_data["projects_portfolio"]):
            chunks.append({
                "id": f"project_{idx}",
                "title": proj.get("name", "Project"),
                "content": proj.get("description", ""),
                "type": "projects"
            })
    
    if "career_goals" in profile_data:
        goals = profile_data["career_goals"]
        chunks.append({
            "id": "career",
            "title": "Career Goals",
            "content": f"{goals.get('short_term', '')}. Long-term: {goals.get('long_term', '')}",
            "type": "career"
        })
    
    return chunks

def setup_vector_database(profile_data):
    """Setup Upstash Vector"""
    print("Setting up Vector database...")
    
    try:
        index = Index.from_env()
        print("Connected to Upstash!")
        
        try:
            info = index.info()
            count = getattr(info, 'vector_count', 0)
            print(f"Vectors in database: {count}")
        except:
            count = 0
        
        if count == 0:
            chunks = create_content_chunks(profile_data)
            vectors = []
            
            for chunk in chunks:
                text = f"{chunk['title']}: {chunk['content']}"
                vectors.append((
                    chunk['id'],
                    text,
                    {"title": chunk['title'], "type": chunk['type']}
                ))
            
            if vectors:
                index.upsert(vectors=vectors)
                print(f"Uploaded {len(vectors)} chunks!")
        
        return index
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def query_vectors(index, query_text, top_k=3):
    """Query the vector database"""
    try:
        results = index.query(
            data=query_text,
            top_k=top_k,
            include_metadata=True
        )
        return results
    except Exception as e:
        print(f"Query error: {str(e)}")
        return None

def generate_response(client, prompt):
    """Generate response with Groq"""
    try:
        completion = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI digital twin. Answer as the person in first person."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

def rag_query(index, client, question):
    """RAG query: vector search + LLM response"""
    try:
        results = query_vectors(index, question, top_k=3)
        
        if not results:
            return "No information found."
        
        docs = []
        for result in results:
            meta = result.metadata or {}
            if meta.get('title'):
                docs.append(f"{meta.get('title')}")
        
        if not docs:
            return "Could not extract details."
        
        context = ", ".join(docs)
        prompt = f"Based on your background ({context}), answer: {question}"
        
        return generate_response(client, prompt)
    except Exception as e:
        return f"Error: {str(e)}"

def main():
    """Main loop"""
    print("Your Digital Twin - AI Profile Assistant")
    print("=" * 40)
    
    profile = load_profile_data()
    if not profile:
        return
    
    client = setup_groq_client()
    if not client:
        return
    
    index = setup_vector_database(profile)
    if not index:
        return
    
    print("Digital Twin ready!\n")
    
    while True:
        question = input("You: ").strip()
        if question.lower() in ["exit", "quit"]:
            print("Goodbye!")
            break
        
        if question:
            answer = rag_query(index, client, question)
            print(f"Twin: {answer}\n")

if __name__ == "__main__":
    main()
