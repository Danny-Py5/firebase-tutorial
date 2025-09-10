import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import auth, { db } from "./firebase-config"; // make sure you export db from firebase-config.ts
import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // firebase needs password for email signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Email Signup (with extra info saved in Firestore)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save extra user info in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        name,
        age,
        phone,
        email,
        createdAt: new Date(),
      });

      console.log("Signup successful:", result.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Save Google user info in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
        phone: result.user.phoneNumber,
        createdAt: new Date(),
        provider: "google",
      });

      console.log("Google signup successful:", result.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <h2>Create an Account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSignup} style={{ marginBottom: "15px" }}>
        <div style={{ marginBottom: "10px", textAlign: "left" }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px", textAlign: "left" }}>
          <label>Age</label>
          <input
            type="number"
            value={age}
            min={0}
            onChange={(e) => setAge(Number(e.target.value))}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px", textAlign: "left" }}>
          <label>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px", textAlign: "left" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px", textAlign: "left" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#1a73e8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p>or</p>

      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#db4437",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {loading ? (
          "Please wait..."
        ) : (
          <>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              style={{ width: "20px", height: "20px" }}
            />
            Sign up with Google
          </>
        )}
      </button>
    </div>
  );
}

export default Signup;
