import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db")

class MyeongshimBrain:
    def __init__(self):
        self.qa_chain = None
        self._initialize_brain()

    def _initialize_brain(self):
        if not os.path.exists(DB_PATH) or not os.listdir(DB_PATH):
            print("Vector DB not found. Please run ingestion first.")
            return

        # 1. Load DB
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vectorstore = Chroma(persist_directory=DB_PATH, embedding_function=embeddings)
        
        # 2. Retriver
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

        # 3. LLM
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.7)

        # 4. Prompt
        # 4. Prompt
        template = """# Role
당신은 명리학과 심리학을 융합한 명심코칭 AI입니다. 
아래의 참고 자료(Context)를 바탕으로 내담자의 질문에 대해 따뜻하고 통찰력 있게 답변하세요.

# Input Constraints (입력 제약 사항)
1. 사용자가 생년월일시만 입력할 경우, **반드시 양력/음력 여부와 성별**을 확인하시오.
2. 정확한 분석을 위해 가능하다면 사용자에게 "만세력 앱에서 확인한 4기둥(8글자)"를 입력받는 것을 권장하시오.
3. 만세력 데이터가 없을 경우, AI는 가장 보편적인 절기 기준으로 간지를 산출하되, 오차가 있을 수 있음을 서두에 명시하시오.

# [Critical] Internal Reasoning Steps (내부 사고 과정 - 출력 금지)
(이 과정은 출력하지 말고, 답변 생성의 논리로만 활용하시오)
1. **Data Validation:** 성별, 양/음력, 시간 확인.
2. **Saju Calculation:** (Code Interpreter가 있다면 사용, 없다면 일반 추론) 월지 기준 조후와 억부 판단.
3. **Psych-Mapping:**
   - 비겁(Self): 자아존중감 vs 고집
   - 식상(Output): 표현욕구 vs 충동성
   - 재성(Goal): 현실감각 vs 통제욕구
   - 관성(Control): 규율준수 vs 억압된 초자아
   - 인성(Input): 수용능력 vs 회피/공상
4. **Integration:** 사주의 불균형 지점을 찾아 CBT 인지 오류와 연결.

# Output Format (출력 형식)
- **결론:** (핵심 조언)
- **분석:** (사주와 심리 연결)
- **제안:** (구체적인 실행 가이드)

참고 자료:
{context}

질문: {question}

답변:"""
        
        prompt = PromptTemplate(template=template, input_variables=["context", "question"])

        # 5. Chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": prompt},
            return_source_documents=True
        )
        print("MyeongshimBrain Initialized.")

    def reload(self):
        self._initialize_brain()

    def get_answer(self, question: str, saju_data: dict = None):
        if not self.qa_chain:
            return {"answer": "아직 지식 베이스가 준비되지 않았습니다. PDF를 업로드하고 학습(Ingest) 시켜주세요.", "sources": []}
        
        # [Enhanced Logic] Inject Saju Data into the Query Context (Silent Injection)
        # We append it to the query so it becomes part of the reasoning input, 
        # but we DON'T want it to mess up retrieval too much.
        # However, for RetrievalQA, the 'query' is used for BOTH retrieval and generation.
        # To avoid retrieving irrelevant docs (matching saju terms), we should keep the query clean for retrieval if possible.
        # But RetrievalQA is rigid.
        # Strategy: Append Saju Info to the PROMPT via the question string sent to LLM?
        # No, RetrievalQA sends 'query' to LLM as {question}.
        # So we modify the question string effectively.
        
        formatted_saju = ""
        if saju_data:
            formatted_saju = f"""
[Client Saju Info]
- Birth: {saju_data.get('birth_date')} {saju_data.get('birth_time')}
- DayMaster (본원): {saju_data.get('dayMaster')}
- Saju 8 Characters: {str(saju_data.get('saju_characters', 'Unknown'))}
- Current Daewoon: {str(saju_data.get('current_luck_cycle', {}))}
- Current Year Luck: {str(saju_data.get('current_yearly_luck', {}))}
"""
        
        # We combine them. Use special separators to help LLM distinguish.
        augmented_query = f"{question}\n\n{formatted_saju}"
        
        # Note: This augmented query is used for Retrieval too. 
        # Ideally, we want retrieval on 'question' only.
        # But for now, let's stick to simple implementation.
        # If retrieval quality drops, we'll need to decouple retrieval_query from generation_query.
        
        result = self.qa_chain.invoke({"query": augmented_query})
        
        return {
            "answer": result["result"],
            "sources": [doc.metadata.get("source", "Unknown") for doc in result["source_documents"]]
        }
