from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai


"""
Performs the full RAG pipeline: retrieves context, then generates an answer.
"""

def get_rag_answer(query: str, collection_name: str, chroma_client, embedding_model, text_generation_model):

    print(f"\n Querying collection '{collection_name}' with: '{query}'")

    try:

        vector_store = Chroma(
            client=chroma_client,
            collection_name=collection_name,
            embedding_function=embedding_model
        )

        retriever = vector_store.as_retriever(search_kwargs={"k":5})

        relevant_docs = retriever.get_relevant_documents(query)

        if not relevant_docs:
            return "I could not any relevant information in the knowledge base to answer your question."
        
        print(f" - Found {len(relevant_docs)} relevant context snippets.")


        context_str = ""
        sources = set()

        for i, doc in enumerate(relevant_docs):
            context_str += f" --- Context Snippet {i+1} ---\n"
            context_str += f"Source: {doc.metadata.get('source')}\n"
            context_str += f"Content: {doc.page_content}\n\n"

        prompt = f"""
        You are Glimpse, an intelligent assistant. Your task is to answer the user's question based *only* on the context provided below.

        - Do not make up any information or use outside knowledge.
        - If the context is not sufficient to answer the question, simply state that you cannot answer based on the provided documents.
        - After your answer, list the source files you used, like this: "Sources: [file1.pdf, file2.jpg]".
        
        CONTEXT:
        {context_str}

        QUESTION:
        {query}

        ANSWER:
        """

        print(" - Synthesis final answer with Gemini")

        answer_response = text_generation_model.generate_content(prompt)

        return answer_response.text
    
    except Exception as e:
        print(f" - An error occured during the RAG process: {e}")
        return "Sorry, an error occured while trying to answer your question."