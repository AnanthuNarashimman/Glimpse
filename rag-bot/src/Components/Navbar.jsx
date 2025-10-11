import Logo from '../assets/Images/Logo.png';
import '../ComponentStyles/Navbar.css';

function Navbar() {
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
        </div>
        
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Created Brains</a>
          <a href="#">Instructions</a>
        </nav>

        <div className="header-right">
          <button className="btn-primary">Contact</button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
