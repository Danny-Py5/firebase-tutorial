// src/components/Auth.tsx
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
// import {} from 'react-router-dom';
import "./Auth.css";
import auth from "../firebase-config";
import Modal from "./Modal.tsx";

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setModalTitle("Success 🎉");
      setModalMessage("User logged out successfully!");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      setModalTitle("Error ❌");
      setModalMessage(error.message);
      setModalType("error");
      setModalOpen(true);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      setModalTitle("Success 🎉");
      setModalMessage(`User ${result.user.email} logged in successfully!`);
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      setModalTitle("Error ❌");
      setModalMessage(error.message);
      setModalType("error");
      setModalOpen(true);
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
          <button onClick={handleLogout} className="auth-btn">
            Logout
          </button>
          <button onClick={handleGoogleLogin} className="auth-btn">
            Login with Google
          </button>
        </form>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
}
