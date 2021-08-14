import Navbar from '../../components/navbar/Navbar'
import { LockOutlined, PersonAddOutlined, EmailOutlined } from '@material-ui/icons'
import './Register.scss'
import { useState, useRef } from 'react'
import { login, register } from '../../api_Interface/api_interface'
import {
  useHistory
} from "react-router-dom";

function Register() {

  const [isLogIn, setIsLogIn] = useState(true);
  const [userNameErrors, setUserNameErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [emailErrors, setEmailErrors] = useState([]);

  const password = useRef(null)
  const username = useRef(null)
  const email = useRef(null)
  const history = useHistory();
  const redirect=(confirmRedirect)=>{
    if(confirmRedirect===true){
      history.push('/');
    }
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    let resp = await login({ username: username.current.value, password: password.current.value, })
    showerrors(resp);
    redirect(resp.success);
  }
  const handleregister = async (e) => {
    e.preventDefault();
    let resp = await register({
      username: username.current.value, password: password.current.value,
      email: email.current.value
    })
    showerrors(resp);
    redirect(resp.success);
  }

  const showerrors = (resp) => {
    if (resp.success)
      return;

    if (resp.username)
      setUserNameErrors(resp.username)
    else
      setUserNameErrors([])
    if (resp.email)
      setEmailErrors(resp.email)
    else
      setEmailErrors([])

    if (resp.password)
      setPasswordErrors(resp.password)

    if (resp.non_field_errors)
      setPasswordErrors(resp.non_field_errors)

    if (resp.password === undefined && resp.non_field_errors === undefined)
      setPasswordErrors([])


  }
  return <div className="register">
    <Navbar />
    <div id="backdrop-img" >
      <img src="https://assets.nflxext.com/ffe/siteui/vlv3/9c5457b8-9ab0-4a04-9fc1-e608d5670f1a/aad8cd4d-f4ac-49af-8539-25a81bf459d0/US-en-20210719-popsignuptwoweeks-perspective_alpha_website_large.jpg" alt=""></img>
    </div>
    <div className="input-container">
      <div className="form-selector">
        <div className={isLogIn ? "form" : "form selected"} onClick={() => setIsLogIn(false)}>
          Register
        </div>

        <div className={isLogIn ? "form selected" : "form"} onClick={() => setIsLogIn(true)}>
          Log in
        </div>
      </div>
      <form className="form-data">
        <div className="form-inputs">
          <div className="form-input">
            <PersonAddOutlined className="icon" />
            <input placeholder="User Name" type="text" ref={username} />
            <span>{userNameErrors}</span>
          </div>
          {!isLogIn &&
            <div className="form-input">
              <EmailOutlined className="icon" />
              <input placeholder="email@example.com" type="email" ref={email} />
              <span>{emailErrors}</span>
            </div>
          }
          <div className="form-input">
            <LockOutlined className="icon" />
            <input placeholder="Password" type="password" ref={password} />
            <span>{passwordErrors}</span>
          </div>
        </div>

        <div className="form-actions">
          {isLogIn && <>
            <p>
              <span>Didn't create an account ? </span> <span className="link" onClick={() => setIsLogIn(false)}>Register</span>
            </p>
            <button onClick={handleLogin}>
              Log In
            </button>
          </>
          }
          {!isLogIn && <>
            <p>
              <span>Already have an Account ? </span> <span className="link" onClick={() => setIsLogIn(true)}>Log in</span>
            </p>
            <button onClick={handleregister}>
              Register
            </button>
          </>
          }
        </div>
      </form>
    </div>
    {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/odM92ap8_c0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
  </div>
}

export default Register