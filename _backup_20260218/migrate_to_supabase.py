"""
ChromaDB → Supabase 마이그레이션 스크립트
PDF 학습 데이터를 Supabase 벡터 DB로 이전합니다.

실행 방법:
1. pip install supabase google-generativeai chromadb python-dotenv
2. .env 파일에 SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_API_KEY 설정
3. python migrate_to_supabase.py
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client
import google.generativeai as genai
import chromadb

load_dotenv()

# 환경 변수
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ChromaDB 경로
CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), "myeongshim_rag", "db")

def migrate():
    print("🚀 ChromaDB → Supabase 마이그레이션 시작...")
    
    # 1. 클라이언트 초기화
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    genai.configure(api_key=GEMINI_API_KEY)
    
    # 2. ChromaDB 연결
    if not os.path.exists(CHROMA_DB_PATH):
        print(f"❌ ChromaDB 경로를 찾을 수 없습니다: {CHROMA_DB_PATH}")
        return
    
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    
    # 모든 컬렉션 가져오기
    collections = client.list_collections()
    if not collections:
        print("❌ ChromaDB에 컬렉션이 없습니다.")
        return
    
    print(f"📚 발견된 컬렉션: {[c.name for c in collections]}")
    
    total_migrated = 0
    
    for collection in collections:
        print(f"\n🔄 컬렉션 '{collection.name}' 마이그레이션 중...")
        
        # 컬렉션 데이터 가져오기
        data = collection.get(include=["documents", "metadatas", "embeddings"])
        
        documents = data.get("documents", [])
        metadatas = data.get("metadatas", [])
        embeddings = data.get("embeddings", [])
        ids = data.get("ids", [])
        
        if not documents:
            print(f"  ⚠️ 문서가 없습니다.")
            continue
        
        print(f"  📄 문서 {len(documents)}개 발견")
        
        # 배치로 Supabase에 삽입
        batch_size = 50
        for i in range(0, len(documents), batch_size):
            batch_docs = documents[i:i+batch_size]
            batch_meta = metadatas[i:i+batch_size] if metadatas else [{}] * len(batch_docs)
            batch_embed = embeddings[i:i+batch_size] if len(embeddings) > 0 else None
            
            records = []
            for j, doc in enumerate(batch_docs):
                # 임베딩이 없으면 새로 생성
                try:
                    embedding = list(batch_embed[j]) if batch_embed is not None and j < len(batch_embed) else None
                except:
                    embedding = None
                    
                if embedding is None:
                    # Gemini 임베딩 생성
                    result = genai.embed_content(
                        model="models/text-embedding-004",
                        content=doc[:8000]  # 길이 제한
                    )
                    embedding = result['embedding']
                
                metadata = batch_meta[j] if batch_meta[j] else {}
                
                # 소스 정보 추출
                source = metadata.get("source", "pdf_import")
                if "/" in source:
                    source = source.split("/")[-1]  # 파일명만 추출
                
                records.append({
                    "content": doc,
                    "embedding": embedding,
                    "metadata": metadata,
                    "source": source[:100]  # 길이 제한
                })
            
            # Supabase에 삽입
            try:
                result = supabase.table("knowledge_base").insert(records).execute()
                total_migrated += len(records)
                print(f"  ✅ {i+1}-{i+len(batch_docs)} 삽입 완료")
            except Exception as e:
                print(f"  ❌ 삽입 실패: {e}")
    
    print(f"\n🎉 마이그레이션 완료! 총 {total_migrated}개 문서 이전됨")
    print("\n다음 단계:")
    print("1. Supabase에서 테이블 확인: knowledge_base")
    print("2. 앱에서 테스트: /debug_rag 재물운")

if __name__ == "__main__":
    migrate()
