import React from 'react';

// Basic styling for this component
const styles = {
  chatWindow: {
    height: '400px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    overflowY: 'auto',
    marginBottom: '10px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    padding: '8px 12px',
    borderRadius: '18px',
    marginBottom: '10px',
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  aiMessage: {
    backgroundColor: '#e9e9eb',
    color: 'black',
    alignSelf: 'flex-start',
  },
  inputArea: {
    display: 'flex',
  },
  input: {
    flex: '1',
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

function ChatComponent({ chatHistory, query, onQueryChange, onSendQuery }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>💬 Ask Questions About Your Files</h3>
      <div style={styles.chatWindow}>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.sender === 'user' ? styles.userMessage : styles.aiMessage),
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          style={styles.input}
          value={query}
          onChange={onQueryChange}
          onKeyPress={(e) => e.key === 'Enter' && onSendQuery()}
          placeholder="Ask a question about your documents..."
        />
        <button style={styles.button} onClick={onSendQuery}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;