import os
import google.generativeai as genai
from supabase import create_client, Client

class MemoryAgent:
    def __init__(self):
        # 1. Initialize Supabase
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise ValueError("Supabase Environment Variables missing")
        self.supabase: Client = create_client(url, key)

        # 2. Initialize Gemini 2.5 Flash
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY missing")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def get_chat_context(self, session_id: str):
        """
        Retrieves 'Summary' from session and 'Last 5 Messages' fro history.
        """
        # A. Get Session Summary
        session_res = self.supabase.table("chat_sessions").select("topic").eq("id", session_id).execute()
        summary = ""
        if session_res.data and len(session_res.data) > 0:
            summary = session_res.data[0].get("topic", "")

        # B. Get Recent Messages (Last 5)
        # Note: We fetch order by desc limit 5, then reverse to preserve logical order
        msg_res = self.supabase.table("chat_messages")\
            .select("role, content")\
            .eq("session_id", session_id)\
            .order("created_at", desc=True)\
            .limit(5)\
            .execute()
        
        recent_messages = msg_res.data[::-1] if msg_res.data else []
        
        return summary, recent_messages

    def log_message(self, session_id: str, role: str, content: str):
        self.supabase.table("chat_messages").insert({
            "session_id": session_id,
            "role": role,
            "content": content
        }).execute()

    def check_and_summarize(self, session_id: str):
        """
        Checks total message count. If > 10, triggers summarization.
        """
        count_res = self.supabase.table("chat_messages")\
            .select("id", count="exact")\
            .eq("session_id", session_id)\
            .execute()
        
        total_count = count_res.count

        # Logic: Trigger summarization if count > 10 
        # (For optimization, we might want to flag if already summarized, but MVP is strictly > 10)
        if total_count and total_count > 10:
            self._generate_and_save_summary(session_id)

    def _generate_and_save_summary(self, session_id: str):
        """
        Fetches ALL history, asks Gemini to summarize, and updates chat_sessions.
        """
        # Fetch all history
        all_msgs_res = self.supabase.table("chat_messages")\
            .select("role, content")\
            .eq("session_id", session_id)\
            .order("created_at", desc=False)\
            .execute()
        
        history_text = "\n".join([f"{m['role']}: {m['content']}" for m in all_msgs_res.data])
        
        prompt = f"""
        [System]
        Analyze the following conversation history.
        Summarize the user's **key characteristics** and the **main counseling topic** in ONE sentence.
        
        [History]
        {history_text}
        
        [Summary]
        """
        
        response = self.model.generate_content(prompt)
        summary_text = response.text.strip()
        
        # Update Session Topic
        self.supabase.table("chat_sessions")\
            .update({"topic": summary_text})\
            .eq("id", session_id)\
            .execute()
            
        print(f"✅ Session {session_id} Summarized: {summary_text}")

    def chat(self, session_id: str, user_input: str):
        # 1. Save User Message
        self.log_message(session_id, "user", user_input)

        # 2. Build Context
        summary, recent_msgs = self.get_chat_context(session_id)
        
        system_context = ""
        if summary:
            system_context += f"Previous Summary: {summary}\n"
        
        context_prompt = f"""
        {system_context}
        [Recent Conversation]
        """
        for m in recent_msgs:
            context_prompt += f"{m['role']}: {m['content']}\n"
            
        final_prompt = f"{context_prompt}\nUser: {user_input}\nAssistant:"

        # 3. Generate Answer
        response = self.model.generate_content(final_prompt)
        answer = response.text

        # 4. Save Assistant Message
        self.log_message(session_id, "assistant", answer)

        # 5. Background Task: Summarize if needed
        self.check_and_summarize(session_id)

        return answer
