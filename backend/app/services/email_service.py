import os

from dotenv import load_dotenv
from email.message import EmailMessage

import aiosmtplib


load_dotenv()


EMAIL_HOST = os.getenv(
    "EMAIL_HOST",
    "smtp.gmail.com"
)

EMAIL_PORT = int(
    os.getenv(
        "EMAIL_PORT",
        "587"
    )
)

EMAIL_USERNAME = os.getenv(
    "EMAIL_USERNAME"
)

EMAIL_PASSWORD = os.getenv(
    "EMAIL_PASSWORD"
)


async def send_reset_code(
    recipient_email: str,
    reset_code: str
):

    message = EmailMessage()

    message["From"] = EMAIL_USERNAME
    message["To"] = recipient_email
    message["Subject"] = "AI Resume Matcher - Password Reset Code"

    message.set_content(
        f"""
Hello,

We received a request to reset your AI Resume Matcher password.

Your password reset code is:

{reset_code}

This code will expire in 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
AI Resume Matcher
"""
    )

    await aiosmtplib.send(
        message,
        hostname=EMAIL_HOST,
        port=EMAIL_PORT,
        username=EMAIL_USERNAME,
        password=EMAIL_PASSWORD,
        start_tls=True
    )