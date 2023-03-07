import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {auth, database} from "../firebase";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { ref, get } from "firebase/database";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const UserType = {
    FAN: 'Fan',
    LUMINARY: 'Luminary',
  };

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const dbRef = ref(database, 'users/' + userCredential.user.uid);
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userType = snapshot.val().selectedMenuItem;
            if (userType === UserType.FAN) {
              navigate("/home");
            } else if (userType === UserType.LUMINARY) {
              navigate("/dash");
            }
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const forgotPassword = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    // TODO: Implement sign in with Google
  };

  // Listen for changes in authentication state
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      const dbRef = ref(database, 'users/' + user.uid);
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userType = snapshot.val().selectedMenuItem.type;
          if (userType === UserType.FAN) {
            navigate("/home");
          } else if (userType === UserType.LUMINARY) {
            navigate("/dash");
          }
        }
      });
    }
  });

  return (
    <div className="sign-in-container">
      <form onSubmit={signIn}>
        <h1>Log In To Your Account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <div className="button-container">
          <button type="submit" className="login-button">Log In</button>
          <button onClick={forgotPassword} className="forgot-password-button">Forgot Password?</button>
          <button onClick={signInWithGoogle} className="google-button">Sign In with Google</button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
