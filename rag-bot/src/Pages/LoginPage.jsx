import { useState } from "react";
import "../PageStyles/LoginPage.css";
import LogImage from "../assets/Images/LogImage.png";
import Logo from "../assets/Images/Logo.png";

function LoginPage() {

  const [formData, setFormData] = useState({
    usermail: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <div className="loginPage">
        <div className="leftAuth">
          <div className="logo authLogo">
            <div className="logo-icon">
              <img src={Logo} alt="" />
            </div>
            <h2>Glimpse</h2>
          </div>

          <img src={LogImage} alt="" />
        </div>
        <div className="rightAuth">
          <div className="authContent">

            <div className="authHead">
              <h2>Welcome Back!</h2>
              <p>Please enter your credentials and get started</p>
            </div>

            <form className="loginForm">

              <h3>SignIn</h3>

              <div className="inputField">
                <label >Email</label>
                <input type="mail" name="usermail" value={formData.usermail} onChange={handleChange} />
              </div>

              <div className="inputField">
                <label >Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>

              <input type="submit" value="Login" />

            </form>

            <p className="signUpRedirect">Don't have an account? <a href="/signup">Sign Up</a></p>

          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
