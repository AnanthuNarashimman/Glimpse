import { useState } from 'react';
import '../ComponentStyles/LandHero.css';

import Visual from '../assets/Images/Visual.png';

function LandHero() {
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
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-headline">
            Unlock Your Data's True Potential.
          </h1>
          
          <p className="hero-subheadline">
            Go beyond keyword search. Ask questions and get intelligent answers from all your documents, images, and audio files in one place.
          </p>
          
          <div className="hero-cta">
            <button onClick={() => openModal('create-brain')} className="btn-hero-primary">
              Create Your First Brain for Free
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-placeholder">
            <img src={Visual} alt="" />
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <h3>Create Your Brain</h3>
              <p>Currently under development.</p>
              <p>Stay tuned for updates!</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default LandHero
