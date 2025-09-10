// src/components/Auth.tsx
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
// import {} from 'react-router-dom';
import "./Auth.css";
import auth from "../firebase-config";
import { useNavigate } from "react-router-dom";
// import Modal from "./Modal.tsx";

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  // console.log(auth.currentUser?.photoURL);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setModalTitle("Success 🎉");
      setModalMessage(
        `User ${userCredential.user.email} created successfully!`
      );
      setModalType("success");
      setModalOpen(true);
      console.log(userCredential);
    } catch (error) {
      setModalTitle("Error ❌");
      setModalMessage(error.message);
      setModalType("error");
      setModalOpen(true);
    }
  };

  const signUp = () => {
    navigate("/signup");
  };
  const handleGoogleLogin = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
          <button onClick={handleGoogleLogin} className="auth-btn">
            Login with Google
          </button>
        </form>
        <br />
        <hr />
        <button onClick={signUp} className="auth-btn">
          Sign Up
        </button>
      </div>

      {/* Modal
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      /> */}
    </div>
  );
}
