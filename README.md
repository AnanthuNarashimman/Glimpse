# Glimpse: The Multimodal Intelligence Engine

![Status](https://img.shields.io/badge/status-under%20development-yellow)

Glimpse is a unified RAG platform that transforms your scattered documents and images into a centralized, queryable knowledge base, allowing you to "chat" with your data.

## 📖 About The Project

In any project, vital information is often fragmented across different formats—reports in PDFs, data in screenshots, and plans in Word documents. Traditional keyword search is inefficient and fails to connect insights across these data silos.

Glimpse solves this problem by creating an intelligent, multimodal "Brain." It uses a powerful Retrieval-Augmented Generation (RAG) pipeline to ingest, understand, and connect information from both text-based documents and images. Users can then ask complex, natural language questions and receive a single, synthesized answer grounded in their own data.

### ✨ Key Features

* **🧠 "Brain" Architecture:** Create isolated knowledge bases for different projects to ensure highly relevant and context-aware responses.
* **📂 Multimodal Ingestion:** Natively processes and understands a variety of formats, including `.pdf`, `.docx`, `.txt`, and images like `.png` and `.jpg`.
* **🔗 Cross-Modal Intelligence:** The AI engine finds deep semantic links between visual data and written text, not just keywords.
* **💬 Unified Query Interface:** A simple, chat-based interface to ask questions and receive intelligent answers.
* **✅ Verifiable AI:** Every answer is grounded with clickable citations to the original source material, ensuring complete trust and transparency.

## 🛠️ Tech Stack

This project is built with a modern, scalable tech stack:

* **Frontend:** React
* **Backend:** Python (Flask)
* **AI/RAG Framework:** LangChain, Google Gemini
* **Database:** ChromaDB (Vector Store) & Firebase (User/Metadata)
* **Cloud & Deployment:** Google Cloud Platform (Cloud Run, Compute Engine), Firebase

## 🏛️ Architecture

The application follows a simple, robust data flow for both ingesting knowledge and answering questions.

**Ingestion Flow:**
`User → React Frontend → Flask API (Ingestion Engine) → Storage Layer (Cloud Storage + ChromaDB)`

**Query Flow:**
`User → React Frontend → Flask API (Query Engine) → Storage Layer → Final Answer`


## Under Development 
The project is under development, working link will be added soon!
