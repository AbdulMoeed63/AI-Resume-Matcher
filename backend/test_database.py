from app.database import client, database

try:
    client.admin.command("ping")

    print("MongoDB connection successful!")
    print(f"Connected to database: {database.name}")

except Exception as e:
    print("MongoDB connection failed!")
    print(e)