from typing import Any, List
from uuid import UUID

from langchain.docstore.document import Document
from langchain.embeddings.base import Embeddings
from langchain.vectorstores import SupabaseVectorStore
from logger import get_logger
from supabase.client import Client

logger = get_logger(__name__)


class CustomSupabaseVectorStore(SupabaseVectorStore):
    """A custom vector store that uses the match_vectors table instead of the vectors table."""

    brain_id: str = "none"

    def __init__(
        self,
        client: Client,
        embedding: Embeddings,
        table_name: str,
        brain_id: str = "none",
    ):
        super().__init__(client, embedding, table_name)
        self.brain_id = brain_id

    def find_brain_closest_query(
        self,
        query: str,
        k: int = 6,
        table: str = "match_brain",
        threshold: float = 0.5,
    ) -> UUID | None:
        vectors = self._embedding.embed_documents([query])
        query_embedding = vectors[0]
        res = self._client.rpc(
            table,
            {
                "query_embedding": query_embedding,
                "match_count": k,
            },
        ).execute()

        # Get the brain_id of the brain that is most similar to the query
        logger.info(f"Found {len(res.data)} brains")
        logger.info(res.data)
        logger.info("🔥🔥🔥🔥🔥")
        brain_id = res.data[0].get("id", None)
        if not brain_id:
            return None
        return str(brain_id)

    def similarity_search(
        self,
        query: str,
        k: int = 6,
        table: str = "match_vectors",
        threshold: float = 0.5,
        **kwargs: Any,
    ) -> List[Document]:
        vectors = self._embedding.embed_documents([query])
        query_embedding = vectors[0]
        res = self._client.rpc(
            table,
            {
                "query_embedding": query_embedding,
                "match_count": k,
                "p_brain_id": str(self.brain_id),
            },
        ).execute()

        match_result = [
            (
                Document(
                    metadata={
                        **search.get("metadata", {}),
                        "id": search.get("id", ""),
                        "similarity": search.get("similarity", 0.0),
                    },
                    page_content=search.get("content", ""),
                ),
                search.get("similarity", 0.0),
            )
            for search in res.data
            if search.get("content")
        ]

        documents = [doc for doc, _ in match_result]

        return documents
