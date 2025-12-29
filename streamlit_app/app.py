import streamlit as st
from supabase import create_client, Client
import google.generativeai as genai
import os
from dotenv import load_dotenv
import datetime
from dateutil import parser

# Load environment variables
load_dotenv()

# --- Configuration ---
st.set_page_config(
    page_title="명심코칭 - 운명 상담소",
    page_icon="🔮",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Custom CSS for "Prettier" Look
st.markdown("""
<style>
    .stChatInputContainer {
        border-color: #D4AF37 !important;
    }
    .stButton>button {
        background-color: #D4AF37;
        color: white;
        border-radius: 20px;
    }
    h1 {
        font-family: 'Helvetica', sans-serif;
        color: #D4AF37;
    }
    .reportview-container {
        background: #050505;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# 1. Initialize Clients
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    st.error("🚨 서버 설정 오류: .env 파일에 SUPABASE_URL 및 Key가 없습니다.")
    st.stop()

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# 2. Key Validation Logic
query_params = st.query_params
access_key = query_params.get("key")

# --- Scenario 1: No Key (Waiting for Deposit) ---
if not access_key:
    st.markdown("""
    <div style="text-align: center; padding-top: 50px;">
        <h1>⏳ 입금 확인 대기 중</h1>
        <p style="font-size: 1.2em; color: #888;">
            신청하신 상담에 대한 입금이 아직 확인되지 않았거나,<br>
            유효하지 않은 링크입니다.
        </p>
        <div style="margin: 30px 0;">
            <span style="font-size: 4em;">🏦</span>
        </div>
        <p style="color: #aaa;">
            입금 완료 후 관리자가 승인하면<br>
            발송된 <strong>접속 링크(Access Key)</strong>를 통해 입장하실 수 있습니다.
        </p>
        <hr style="border-color: #333;">
        <p style="font-size: 0.9em; color: #666;">문의: support@myeongsim.com</p>
    </div>
    """, unsafe_allow_html=True)
    st.stop()

# --- Scenario 2: Validate Key & User ---
try:
    user_res = supabase.table("users").select("*").eq("access_key", access_key).single().execute()
    user = user_res.data
except Exception as e:
    user = None

if not user:
    st.error("❌ 유효하지 않은 Access Key입니다. 링크를 다시 확인해주세요.")
    st.stop()

# Check Coins & Time (Lazy Start Logic)
current_coins = user.get('coins', 0)
user_uuid = user.get('id')
user_email = user.get('email', '익명')
access_at_str = user.get('access_at')
duration_min = user.get('duration_minutes', 30)

now_utc = datetime.datetime.now(datetime.timezone.utc)

# 3. Time Check Logic
if access_at_str:
    # Already Started
    access_at = parser.isoparse(access_at_str)
    expire_at = access_at + datetime.timedelta(minutes=duration_min)
    remaining_seconds = (expire_at - now_utc).total_seconds()

    if remaining_seconds <= 0:
        st.error(f"🚨 이용 시간이 종료되었습니다. (총 {duration_min}분 이용 완료)")
        st.warning("추가 상담을 원하시면 이용권을 재구매해주세요.")
        st.stop()
    
    # Format remaining time
    rem_min = int(remaining_seconds // 60)
    rem_sec = int(remaining_seconds % 60)
    st.sidebar.markdown(f"## ⏳ 남은 시간: {rem_min}분 {rem_sec}초")
else:
    # Not Started Yet
    st.sidebar.success(f"🎟️ 이용권: {duration_min}분 (첫 질문 시 시작)")

# Sidebar Info
st.sidebar.markdown(f"💰 남은 코인: {current_coins}개")
st.sidebar.markdown(f"📧 계정: {user_email}")

if current_coins <= 0:
    st.warning("🚨 보유 코인을 모두 사용하셨습니다. 충전 후 이용해주세요!")
    st.stop()

# --- Session Management (For Chat History Persistence) ---
if "session_id" not in st.session_state:
    session_data = supabase.table("chat_sessions").select("id").eq("user_id", str(user_uuid)).order("created_at", desc=True).limit(1).execute()
    
    if session_data.data:
        st.session_state.session_id = session_data.data[0]['id']
    else:
        new_sess = supabase.table("chat_sessions").insert({
            "user_id": str(user_uuid),
            "topic": "Access Key Consultation"
        }).execute()
        st.session_state.session_id = new_sess.data[0]['id']

session_id = st.session_state.session_id

# --- Main UI ---
st.title("🔮 명심코칭 : 운명 상담")
st.caption(f"반갑습니다, **{user_email}**님.")

# Initialize Local Chat State
if "messages" not in st.session_state:
    st.session_state.messages = []
    hist_res = supabase.table("chat_messages").select("*").eq("session_id", session_id).order("created_at", desc=False).execute()
    if hist_res.data:
        for m in hist_res.data:
            st.session_state.messages.append({"role": m['role'], "content": m['content']})

# Display Chat
for message in st.session_state.messages:
    avatar = "👤" if message["role"] == "user" else "🤖"
    with st.chat_message(message["role"], avatar=avatar):
        st.markdown(message["content"])

# --- Chat Logic ---
if prompt := st.chat_input("무엇이든 물어보세요 (1코인 차감)"):
    
    # [Lazy Start] First Access Trigger
    if not access_at_str:
        now_iso = now_utc.isoformat()
        supabase.table("users").update({"access_at": now_iso}).eq("id", user_uuid).execute()
        st.toast("⏱️ 상담 시간이 지금부터 시작됩니다!")
        # Update local variable to prevent 'Not Started' view next re-run
        # We don't rerun immediately to keep the current prompt processing smooth
        access_at_str = now_iso 

    # 1. UI Append User Message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user", avatar="👤"):
        st.markdown(prompt)

    # 2. Save User Message to DB
    supabase.table("chat_messages").insert({
        "session_id": session_id,
        "role": "user",
        "content": prompt
    }).execute()

    # 3. Generate Answer
    with st.chat_message("assistant", avatar="🤖"):
        message_placeholder = st.empty()
        full_response = ""
        
        try:
            history_context = [{"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]} for m in st.session_state.messages[:-1]]
            
            chat = model.start_chat(history=history_context)
            response = chat.send_message(prompt, stream=True)
            
            for chunk in response:
                if chunk.text:
                    full_response += chunk.text
                    message_placeholder.markdown(full_response + "▌")
            
            message_placeholder.markdown(full_response)
            
            # 4. Save Assistant Message and Deduct Coin
            supabase.table("chat_messages").insert({
                "session_id": session_id,
                "role": "assistant",
                "content": full_response
            }).execute()

            new_coin_count = current_coins - 1
            supabase.table("users").update({"coins": new_coin_count}).eq("id", user_uuid).execute()
            
            st.session_state.messages.append({"role": "assistant", "content": full_response})
            # To update coin display effectively, we might want to rerun, but let's avoid jarring refresh.
            
        except Exception as e:
            st.error(f"Error: {str(e)}")
