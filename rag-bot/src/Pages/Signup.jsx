import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ComponentStyles/AuthForm.css';

function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.getElementById('auth-container');
    if (container) {
      container.classList.add('sign-up');
      container.classList.remove('sign-in');
    }
  }, []);

  const goToLogin = useCallback((e) => {
    e.preventDefault();
    const container = document.getElementById('auth-container');
    if (container) {
      container.classList.remove('sign-up');
      container.classList.add('sign-in');
    }
    setTimeout(() => navigate('/login'), 700);
  }, [navigate]);

  return (
    <div className="container sign-up" id="auth-container">
      <div className="content-row">
        <div className="col text sign-in">
          <h2>Welcome</h2>
        </div>
        <div className="col text sign-up">
          <h2>Join with us</h2>
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col">
          <div className="form-wrapper">
            <form className="form sign-up" id="signup-form">
              <h2>Sign up</h2>
              <div className="input-group">
                <label htmlFor="signup-email">Email</label>
                <input type="email" id="signup-email" name="email" required />
              </div>
              <div className="input-group">
                <label htmlFor="signup-password">Password</label>
                <input type="password" id="signup-password" name="password" required />
              </div>
              <div className="input-group">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <input type="password" id="signup-confirm-password" name="confirm_password" required />
              </div>
              <button type="submit" className="submit-btn">Sign up</button>
              <p className="switch-link">
                Already have an account? <a href="/login" onClick={goToLogin}>Sign in here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;


