"""
PDF → Supabase 직접 학습 스크립트
src/knowledge/docs/ 폴더의 PDF들을 Supabase knowledge_base에 저장합니다.
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client
import google.generativeai as genai
from PyPDF2 import PdfReader

load_dotenv()

# 환경 변수
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# PDF 폴더 경로
PDF_PATH = os.path.join(os.path.dirname(__file__), "src", "knowledge", "docs")

def chunk_text(text, chunk_size=1000, overlap=200):
    """텍스트를 청크로 나눔"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks

def ingest_pdfs():
    print("🚀 PDF → Supabase 학습 시작...")
    
    # 클라이언트 초기화
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    genai.configure(api_key=GEMINI_API_KEY)
    
    if not os.path.exists(PDF_PATH):
        print(f"❌ PDF 폴더를 찾을 수 없습니다: {PDF_PATH}")
        return
    
    # PDF 파일 목록
    pdf_files = [f for f in os.listdir(PDF_PATH) if f.endswith('.pdf')]
    print(f"📚 발견된 PDF: {len(pdf_files)}개")
    
    total_chunks = 0
    
    for idx, pdf_file in enumerate(pdf_files):
        print(f"\n[{idx+1}/{len(pdf_files)}] 📄 {pdf_file[:50]}...")
        
        try:
            # PDF 읽기
            pdf_path = os.path.join(PDF_PATH, pdf_file)
            reader = PdfReader(pdf_path)
            
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            if not text.strip():
                print(f"  ⚠️ 텍스트 추출 실패 (스캔 이미지?)")
                continue
            
            # 청크로 나누기
            chunks = chunk_text(text, chunk_size=1500, overlap=200)
            print(f"  📝 {len(chunks)}개 청크 생성")
            
            # 각 청크를 Supabase에 저장
            for i, chunk in enumerate(chunks):
                if len(chunk.strip()) < 50:  # 너무 짧은 청크 스킵
                    continue
                    
                try:
                    # 임베딩 생성
                    result = genai.embed_content(
                        model="models/text-embedding-004",
                        content=chunk[:8000]
                    )
                    embedding = result['embedding']
                    
                    # Supabase에 저장
                    record = {
                        "content": chunk,
                        "embedding": embedding,
                        "metadata": {
                            "source": pdf_file,
                            "chunk_index": i,
                            "total_chunks": len(chunks)
                        },
                        "source": pdf_file[:100]
                    }
                    
                    supabase.table("knowledge_base").insert(record).execute()
                    total_chunks += 1
                    
                except Exception as e:
                    print(f"  ❌ 청크 {i} 저장 실패: {str(e)[:50]}")
                    continue
            
            print(f"  ✅ 완료!")
            
        except Exception as e:
            print(f"  ❌ PDF 읽기 실패: {str(e)[:50]}")
            continue
    
    print(f"\n🎉 학습 완료! 총 {total_chunks}개 청크 저장됨")
    print("\n앱에서 테스트: /debug_rag 재물운")

if __name__ == "__main__":
    ingest_pdfs()
