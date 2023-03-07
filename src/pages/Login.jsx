import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      const errorCode = err.code;
      switch (errorCode) {
        case "auth/user-not-found":
          setErrMessage("User Not Found Kindle Register");
          setErr(true);
          break;
        case "auth/wrong-password":
          setErrMessage("Wrong Password");
          setErr(true);
          break;        

        default:
          setErrMessage("Someting Went Wrong");
          setErr(true);
      }
    }
  };

  const resetError = () => {
    if (err) {
      setErr(false);
      setErrMessage("");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Messenger</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            onChange={resetError}
            required
          />
          <input
            type="password"
            placeholder="password"
            onChange={resetError}
            required
          />
          <button>Sign in</button>
          {err && <span>{errMessage}</span>}
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
