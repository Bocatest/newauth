import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import "./SignIn.css";

const UserType = {
  FAN: 1,
  LUMINARY: 2,
};

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userID = user.uid;
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.userType !== undefined) {
            setUserType(userData.userType);
          } else {
            console.error("userType not found in user document");
          }
        } else {
          console.error("user document not found");
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const userID = userCredential.user.uid;
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.userType !== undefined) {
            setUserType(userData.userType);
            if (userData.userType === UserType.FAN) {
              navigate("/home");
            } else if (userData.userType === UserType.LUMINARY) {
              navigate("/dash");
            }
          }
        }
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
    if (userType === UserType.FAN) {
      // TODO: Implement sign in with Google for fans
    } else if (userType === UserType.LUMINARY) {
      // TODO: Implement sign in with Google for luminaries
    }
  };

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
      <button type="submit" className="login-button">
        Log In
      </button>
      <button onClick={forgotPassword} className="forgot-password-button">
        Forgot Password?
      </button>
      <button onClick={signInWithGoogle} className="google-button">
        Sign In with Google
      </button>
    </div>
    </form>
    <p>
    Don't have an account?{" "}
    <Link to="/signup">Sign up here</Link>
  </p>
 </div>
  );
};
export default SignIn;