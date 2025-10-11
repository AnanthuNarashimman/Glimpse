import React, { useState } from 'react';

// Styling for the modal and components
const styles = {
  uploadButton: {
    padding: '12px 24px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    margin: '20px 0',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '15px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInput: {
    marginBottom: '20px',
    padding: '10px',
    border: '2px dashed #007bff',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  },
  fileList: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    marginBottom: '8px',
    border: '1px solid #e0e0e0',
  },
  fileName: {
    flex: 1,
    fontSize: '14px',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  uploadFilesButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
  },
  uploadedList: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e7f3ff',
    borderRadius: '8px',
  },
  uploadedItem: {
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  statusMessage: {
    padding: '10px',
    borderRadius: '6px',
    marginTop: '15px',
    textAlign: 'center',
  },
  statusSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  statusLoading: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
};

function UploadComponent({ onFilesUploaded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    event.target.value = null; // Reset input to allow selecting the same file again
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setStatus({ message: 'Please select at least one file.', type: 'error' });
      return;
    }

    setIsUploading(true);
    setStatus({ message: `Uploading ${selectedFiles.length} file(s)...`, type: 'loading' });

    const API_BASE_URL = 'http://localhost:5000/api';
    
    try {
      // Option 1: Use batch upload endpoint for better performance (if multiple files)
      if (selectedFiles.length > 1) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });

        const response = await fetch(`${API_BASE_URL}/upload-batch`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        // Extract successful uploads
        const successfulUploads = data.results
          ? data.results.filter(r => r.status === 'success').map(r => r.filename)
          : [];
        
        setUploadedFiles([...uploadedFiles, ...successfulUploads]);
        setSelectedFiles([]);
        
        if (data.failed === 0) {
          setStatus({ 
            message: `✅ Successfully uploaded ${data.successful} file(s)!`, 
            type: 'success' 
          });
        } else {
          setStatus({ 
            message: `⚠️ Uploaded ${data.successful} file(s), ${data.failed} failed.`, 
            type: 'error' 
          });
        }

        // Notify parent component
        if (onFilesUploaded) {
          onFilesUploaded(successfulUploads);
        }
        
      } else {
        // Option 2: Single file upload (original method)
        const uploadResults = [];
        
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);

          try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            
            if (response.ok) {
              uploadResults.push({ name: file.name, success: true });
            } else {
              uploadResults.push({ name: file.name, success: false, error: data.error });
            }
          } catch (error) {
            uploadResults.push({ name: file.name, success: false, error: error.message });
          }
        }

        // Update uploaded files list
        const successfulUploads = uploadResults.filter(r => r.success).map(r => r.name);
        setUploadedFiles([...uploadedFiles, ...successfulUploads]);
        
        // Clear selected files
        setSelectedFiles([]);
        
        // Set status message
        const successCount = successfulUploads.length;
        const failCount = uploadResults.length - successCount;
        
        if (failCount === 0) {
          setStatus({ 
            message: `✅ Successfully uploaded ${successCount} file(s)!`, 
            type: 'success' 
          });
        } else {
          setStatus({ 
            message: `⚠️ Uploaded ${successCount} file(s), ${failCount} failed.`, 
            type: 'error' 
          });
        }

        // Notify parent component
        if (onFilesUploaded) {
          onFilesUploaded(successfulUploads);
        }
      }
    } catch (error) {
      setStatus({ message: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setStatus({ message: '', type: '' });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFiles([]);
    setStatus({ message: '', type: '' });
  };

  return (
    <>
      <button style={styles.uploadButton} onClick={openModal}>
        📤 Upload Files
      </button>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>Upload Your Knowledge</h2>
              <button style={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>

            <div style={styles.fileInput}>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
                Supported: PDF, DOCX, TXT, PNG, JPG, JPEG
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div style={styles.fileList}>
                <h4>Selected Files ({selectedFiles.length})</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} style={styles.fileItem}>
                    <span style={styles.fileName}>{file.name}</span>
                    <button
                      style={styles.removeButton}
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              style={{
                ...styles.uploadFilesButton,
                opacity: isUploading || selectedFiles.length === 0 ? 0.6 : 1,
                cursor: isUploading || selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
              }}
              onClick={handleUploadFiles}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
            </button>

            {status.message && (
              <div
                style={{
                  ...styles.statusMessage,
                  ...(status.type === 'success' ? styles.statusSuccess :
                      status.type === 'error' ? styles.statusError :
                      styles.statusLoading),
                }}
              >
                {status.message}
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div style={styles.uploadedList}>
                <h4 style={{ marginTop: 0 }}>📚 Uploaded Files ({uploadedFiles.length})</h4>
                {uploadedFiles.map((fileName, index) => (
                  <div key={index} style={styles.uploadedItem}>
                    ✓ {fileName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UploadComponent;