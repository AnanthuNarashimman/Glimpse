import ChatComponent from "../Components/ChatComponent"
import UploadComponent from "../Components/UploadComponent"
import { useState } from "react";

const styles = {
  pageContainer: {
    maxWidth: '800px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  status: {
    marginTop: '10px',
    color: '#666',
    textAlign: 'center',
  },
  uploadedFilesInfo: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f0f8ff',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#333',
  },
};


function ChatPage() {

    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [status, setStatus] = useState('Welcome! Upload documents to begin.');
    const [totalUploadedFiles, setTotalUploadedFiles] = useState(0);

    const API_BASE_URL = 'http://localhost:5000/api';

    const handleFilesUploaded = (fileNames) => {
        setTotalUploadedFiles(prev => prev + fileNames.length);
        setStatus(`✅ Successfully uploaded ${fileNames.length} file(s). You can now ask questions!`);
    };

    const handleSendQuery = async () => {
        if (!query.trim()) return;

        const newChatHistory = [...chatHistory, { sender: 'user', text: query }];
        setChatHistory(newChatHistory);
        const currentQuery = query;
        setQuery('');
        setStatus('🧠 Thinking...');

        try {
            const response = await fetch(`${API_BASE_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: currentQuery }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Query failed.');
            setChatHistory([...newChatHistory, { sender: 'ai', text: data.answer }]);
            setStatus('Ready for your next question.');
        } catch (error) {
            console.error('Query Error:', error);
            setChatHistory([...newChatHistory, { sender: 'ai', text: `Sorry, an error occurred: ${error.message}` }]);
            setStatus('An error occurred. Please try again.');
        }
    };


    return (
        <>
            <div style={styles.pageContainer}>
                <div style={styles.header}>
                    <h1>Glimpse</h1>
                    <p>Your Multimodal Intelligence Engine</p>
                </div>

                <UploadComponent onFilesUploaded={handleFilesUploaded} />

                {totalUploadedFiles > 0 && (
                    <div style={styles.uploadedFilesInfo}>
                        📚 Knowledge Base: {totalUploadedFiles} file(s) uploaded
                    </div>
                )}

                <ChatComponent
                    chatHistory={chatHistory}
                    query={query}
                    onQueryChange={(e) => setQuery(e.target.value)}
                    onSendQuery={handleSendQuery}
                />

                <div style={styles.status}>
                    <p>{status}</p>
                </div>
            </div>
        </>
    )
}

export default ChatPage
