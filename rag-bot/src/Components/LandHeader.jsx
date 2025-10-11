import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ComponentStyles/LandHeader.css';
import Logo from '../assets/Images/Logo.png';

function LandHeader() {
  const navigate = useNavigate();
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
            <a href="#how">How It Works</a>
            <a href="#usecase">Use Cases</a>
            <a href="#updates">Updates</a>
          </nav>
        </div>
        
        <div className="header-right">
          <button onClick={() => navigate('/login')} className="btn-outline">Log in</button>
          <button onClick={() => navigate('/signup')} className="btn-primary">Sign up</button>
        </div>
      </div>
      
      
    </header>
  )
}

export default LandHeader
