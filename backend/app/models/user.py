from app.database import users_collection


def create_user(user_data: dict):
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)


def get_user_by_email(email: str):
    return users_collection.find_one({
        "email": email
    })


def get_user_by_id(user_id):
    from bson import ObjectId

    return users_collection.find_one({
        "_id": ObjectId(user_id)
    })


def update_user_password(
    email: str,
    hashed_password: str
):
    result = users_collection.update_one(
        {
            "email": email
        },
        {
            "$set": {
                "password": hashed_password
            }
        }
    )

    return result.modified_count > 0


def get_user_by_google_id(google_id: str):
    return users_collection.find_one({
        "google_id": google_id
    })


def add_google_account(
    user_id,
    google_id: str
):
    from bson import ObjectId

    users_collection.update_one(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$set": {
                "google_id": google_id
            }
        }
    )


def create_google_user(
    name: str,
    email: str,
    google_id: str
):
    user_data = {
        "name": name,
        "email": email,
        "google_id": google_id,
        "auth_provider": "google"
    }

    result = users_collection.insert_one(
        user_data
    )

    return str(result.inserted_id)