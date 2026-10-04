from app.database import users_collection


def create_user(user_data: dict):
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)


def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})


def get_user_by_id(user_id):
    from bson import ObjectId

    return users_collection.find_one({"_id": ObjectId(user_id)})