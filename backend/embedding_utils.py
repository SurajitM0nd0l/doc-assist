# backend/embedding_utils.py

import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from config import EMBEDDING_MODEL, TOP_K_RETRIEVAL

embedder = SentenceTransformer(EMBEDDING_MODEL)

class Embedder:
    def __init__(self):
        self.chunks = []
        self.embeddings = []
        self.index = None

    def encode_and_index(self, chunks):
        self.chunks = chunks
        self.embeddings = embedder.encode(chunks)
        dim = len(self.embeddings[0])
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(np.array(self.embeddings).astype("float32"))

    def retrieve_top_chunks(self, query, k=TOP_K_RETRIEVAL):
        query_embedding = embedder.encode([query])[0].astype("float32")
        _, indices = self.index.search(np.array([query_embedding]), k)
        return [self.chunks[i] for i in indices[0]]
