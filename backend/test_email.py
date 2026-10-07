import asyncio

from app.services.email_service import send_reset_code


async def main():
    await send_reset_code(
        "moeedali806@gmail.com",
        "123456"
    )

    print("Test email sent successfully!")


asyncio.run(main())