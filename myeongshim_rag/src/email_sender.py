import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class EmailSender:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email_user = os.getenv("EMAIL_USER")
        self.email_password = os.getenv("EMAIL_PASSWORD") # Python App Password

        if not self.email_user or not self.email_password:
            raise ValueError("❌ Error: EMAIL_USER or EMAIL_PASSWORD missing in .env")

    def send_email(self, to_email: str, subject: str, body: str):
        try:
            # Create Message
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = to_email
            msg['Subject'] = subject

            # Attach Body
            msg.attach(MIMEText(body, 'plain'))

            # Connect to SMTP Server
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls() # Secure connection
            server.login(self.email_user, self.email_password)
            
            # Send Email
            text = msg.as_string()
            server.sendmail(self.email_user, to_email, text)
            server.quit()

            print(f"✅ Email sent successfully to {to_email}")
            return True

        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            return False

# Example Usage (Run this file directly to test)
if __name__ == "__main__":
    sender = EmailSender()
    # Replace with a real recipient for testing
    recipient = "test_recipient@example.com" 
    sender.send_email(
        recipient, 
        "[SajuCBT] 테스트 이메일", 
        "안녕하세요,\n사주CBT 명심코칭 서비스 이메일 발송 테스트입니다.\n감사합니다."
    )
