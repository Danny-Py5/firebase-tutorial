import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./components/Auth";
import auth from "./firebase-config";
import Dashboard from "./dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        // User is logged in, show the dashboard
        <Dashboard user={user} />
      ) : (
        // User is not logged in, show the login page
        <>
          <h1 style={{ textAlign: "center", margin: "2rem 0" }}>
            Firebase Tutorial
          </h1>
          <Auth />
        </>
      )}
    </div>
  );
}

export default App;
