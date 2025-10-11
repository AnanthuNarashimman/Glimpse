import { useState } from "react";
import "../PageStyles/LoginPage.css";
import LogImage from "../assets/Images/LogImage.png";
import Logo from "../assets/Images/Logo.png";

function SignupPage() {

    const [formData, setFormData] = useState({
        username: "",
        usermail: "",
        password: "",
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
                            <h2>Welcome!</h2>
                            <p>Let's create an account for you</p>
                        </div>

                        <form className="loginForm signupForm">

                            <h3>SignUp</h3>

                            <div className="inputField">
                                <label >User Name</label>
                                <input type="tetx" name="username" value={formData.username} onChange={handleChange} />
                            </div>

                            <div className="inputField">
                                <label >Email</label>
                                <input type="mail" name="usermail" value={formData.usermail} onChange={handleChange} />
                            </div>

                            <div className="inputField">
                                <label >Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                            </div>

                            <input className="signupButton" type="submit" value="Register" />

                        </form>

                        <p className="signUpRedirect">Already have an account? <a href="/signin">Sign in</a></p>

                    </div>
                </div>
            </div>
        </>
    )
}

export default SignupPage
