<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" alt="Verixa AI Logo" width="120" height="120" style="border-radius: 20px;">
  
  <h1 align="center">✨ Verixa AI ✨</h1>
  
  <p align="center">
    <strong>An Enterprise-Grade RAG Document Q&A Platform</strong>
    <br />
    <em>Transform how your team interacts with knowledge bases, policies, and internal documents using advanced AI.</em>
  </p>

  <p align="center">
    <a href="#"><img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black" alt="React"></a>
    <a href="#"><img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" alt="Vite"></a>
    <a href="#"><img src="https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white" alt="Node.js"></a>
    <a href="#"><img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB"></a>
    <a href="#"><img src="https://img.shields.io/badge/AI-OpenAI-412991?logo=openai&logoColor=white" alt="OpenAI"></a>
    <a href="#"><img src="https://img.shields.io/badge/Tailwind-4-38b2ac?logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  </p>
</div>

<br />

## 📖 About the Project

**Verixa AI** is a cutting-edge SaaS platform designed to instantly unlock the knowledge trapped inside your company's documents, PDFs, employee handbooks, and SOPs. Instead of endless Ctrl+F searching, your employees can now ask natural language questions and get accurate, context-aware answers complete with **page-level citations**.

By adopting Verixa AI, organizations reduce HR and IT ticket volumes by up to **60%**, empowering employees with an intelligent self-service portal.

---

## 📸 Sneak Peek

<div align="center">
  <img src="./public/Login-Verixa AI.png" alt="App Preview GIF" width="80%">
  <p><em>Experience real-time AI responses directly from your uploaded policies.</em></p>
</div>

---

## 🚀 Key Features

- **📄 Smart Document Ingestion**: Upload PDFs with automatic text extraction, optimal chunking, and intelligent indexing.
- **🤖 Advanced RAG Q&A (Retrieval-Augmented Generation)**: Chat dynamically with your internal knowledge base.
- **🔗 Source Citations**: Every AI response points back exactly to the source document, giving employees confident answers.
- **🛡️ Enterprise Security & RBAC**: Strict admin panels, secure auth (JWT), password recovery, and segmented access control.
- **⚡ Real-time Streaming**: LLM outputs stream smoothly to the interface in real time, feeling just like ChatGPT.
- **📈 SEO-Optimized Routing**: Public landing and feature pages fully optimized for traditional and AI-search engines.

---

## 🏗️ Architecture & RAG System Overview

Our robust **RAG (Retrieval-Augmented Generation)** pipeline handles document ingestion and real-time inference efficiently to eliminate LLM hallucinations:

1.  **Ingestion & Chunking**: When an Admin uploads a PDF, the document is securely parsed and processed through our custom `chunkText.js` pipeline to create optimally sized, semantically meaningful text segments.
2.  **Embedding Generation**: The `embeddingService.js` dispatches text chunks to an embedding model (e.g., OpenAI `text-embedding-3-small`) to generate high-dimensional vectors representing the semantics of the text.
3.  **Vector Storage**: Vectors are securely stored alongside metadata in MongoDB.
4.  **Intelligent Retrieval**: When a query hits `queryRoutes.js`, the `retrievalService.js` embeds the user's question on-the-fly and searches for the top-K most relevant chunks using vector cosine similarity.
5.  **Contextual Generation**: The `llmService.js` combines retrieved context and user query via an optimized prompt. The LLM (e.g., GPT-4o) generates the answer _solely_ based on the custom context, streaming the response securely to the client.

---

## 🛠️ Technology Stack & Packages

### 💻 Frontend (Client-Side)

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4, `@tailwindcss/typography`
- **Icons & UI**: `lucide-react`, `clsx`, `tailwind-merge`
- **State Management**: Zustand (Global Store), React Context (Auth)
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **Animations**: Framer Motion
- **Markdown & UI**: `react-markdown`, `remark-gfm`
- **Notifications**: `react-hot-toast`

### ⚙️ Backend (Server-Side)

- **Runtime**: Node.js + Express.js 5
- **Database**: MongoDB via Mongoose 9 (`mongoose`)
- **AI/LLM Integration**: OpenAI Official SDK (`openai`)
- **Security & Auth**: Node Crypto, `express-rate-limit`, CORS
- **File Processing**: `multer` (File Uploads)
- **Email & Passwords**: `nodemailer` (Email recovery & password resets)

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas cluster (or local instance)
- OpenAI API Key

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/enterprise-project-saas.git
    cd enterprise-project-saas
    ```

2.  **Install Frontend Dependencies:**

    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**

    ```bash
    cd backend
    npm install
    cd ..
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    OPENAI_API_KEY=your_openai_api_key
    JWT_SECRET=your_jwt_secret_key
    FRONTEND_URL=http://localhost:5173
    EMAIL_USER=your_smtp_email
    EMAIL_PASS=your_smtp_password
    ```

5.  **Run the Application Locally:**
    Open two terminal tabs:

    _Tab 1: Start Frontend_

    ```bash
    npm run dev
    ```

    _Tab 2: Start Backend_

    ```bash
    cd backend
    npm start
    ```

🎉 **You are all set! Let the AI handle the answers for you.**

---

<div align="center">
  <p>Built with ❤️ by the Verixa AI Team</p>
</div>
