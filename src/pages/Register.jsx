import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const re_password = e.target[3].value;
    const file = e.target[4].files[0];

    if (!file) {
      setErrMessage("Kindle upload a photo");
      setErr(true);
    } else if (password != re_password) {
      setErrMessage("password does not match..Kindly Check");
      setErr(true);
    } else {
      try {
        //Create user
        const res = await createUserWithEmailAndPassword(auth, email, password);

        //Create a unique image name
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);

        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              //Update profile
              await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              });
              //create user on firestore
              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL: downloadURL,
              });

              //create empty user chats on firestore
              await setDoc(doc(db, "userChats", res.user.uid), {});
              navigate("/");
            } catch (err) {
              console.log(err);
              setErr(true);
              setLoading(false);
            }
          });
        });
      } catch (err) {
        setErr(true);
        setLoading(false);

        const errCode = err.code;
        console.log(errCode);
        switch (errCode) {
          case "auth/email-already-in-use":
            setErrMessage("Accound already exits . Kindly Login !");
            setErr(true);
            break;

          default:
            setErrMessage("Something went Wrong");
            setErr(true);
        }
      }
    }
  };

  const resetErr = () => {
    console.log(err);
    if (err) {
      setErrMessage("");
      setErr(false);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Messenger</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit} onChange={resetErr}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required type="password" placeholder="Enter password again" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && !err && <span style={{color:"green"}}>Creating Accoutn Please Wait</span>}
          {err && <span style={{color:"red"}}>{errMessage}</span>}
        </form>
        <p>
          You do have an account? <Link to="/register">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
