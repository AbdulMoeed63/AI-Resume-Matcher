from sentence_transformers import SentenceTransformer


# Load the AI model once when the application starts
model = SentenceTransformer("all-mpnet-base-v2")


def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """
    Calculate semantic similarity between two pieces of text.

    Returns:
        Similarity score as a percentage from 0 to 100.
    """

    embeddings = model.encode(
        [text1, text2],
        normalize_embeddings=True
    )

    similarity = float(embeddings[0] @ embeddings[1])

    similarity_percentage = max(0.0, min(100.0, similarity * 100))

    return round(similarity_percentage, 2)