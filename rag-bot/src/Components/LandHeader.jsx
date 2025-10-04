import { useState } from 'react';
import '../ComponentStyles/LandHeader.css';
import Logo from '../assets/Images/Logo.png';

function LandHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
            
          <div className="logo">
            <div className="logo-icon">
              <img src={Logo} alt="" />
            </div>
            <h2>Glimpse</h2>
          </div>
          
          <nav className="nav-links">
            <a href="#docs">How It Works</a>
            <a href="#cloud">Features</a>
            <a href="#cloud">Use Cases</a>
            <a href="#updates">Updates</a>
          </nav>
        </div>
        
        <div className="header-right">
          <button onClick={() => openModal('login')} className="btn-outline">Log in</button>
          <button onClick={() => openModal('signup')} className="btn-primary">Sign up</button>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <h3>{modalType === 'login' ? 'Log In' : 'Sign Up'}</h3>
              <p>Currently under development.</p>
              <p>Stay tuned for updates!</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default LandHeader
