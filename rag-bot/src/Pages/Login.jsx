import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ComponentStyles/AuthForm.css';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.getElementById('auth-container');
    if (container) {
      container.classList.add('sign-in');
      container.classList.remove('sign-up');
    }
  }, []);

  const goToSignup = useCallback((e) => {
    e.preventDefault();
    const container = document.getElementById('auth-container');
    if (container) {
      container.classList.remove('sign-in');
      container.classList.add('sign-up');
    }
    setTimeout(() => navigate('/signup'), 700);
  }, [navigate]);

  return (
    <div className="container sign-in" id="auth-container">
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
            <form className="form sign-in" id="login-form">
              <h2>LOG IN</h2>
              <div className="input-group">
                <label htmlFor="login-email">Email</label>
                <input type="email" id="login-email" name="email" required />
              </div>
              <div className="input-group">
                <label htmlFor="login-password">Password</label>
                <input type="password" id="login-password" name="password" required />
              </div>
              <button type="submit" className="submit-btn">LOG IN</button>
              <p className="switch-link">
                Don't have an account? <a href="/signup" onClick={goToSignup}>Sign up here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


