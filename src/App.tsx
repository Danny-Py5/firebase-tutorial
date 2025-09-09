// import { useState } from "react";
import Auth from "./components/Auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase-config";
import React, { useState, useEffect } from "react";

interface Work {
  description: string;
  isDone: boolean;
  location: string;
  price: number;
  type: string;
  id: string;
  isEditing: boolean;
}

function App() {
  // for fetching posts
  const [loading, setLoading] = useState<boolean>(false);
  const [workList, setWorkList] = useState<Work[]>([
    {
      description: "",
      isDone: false,
      location: "",
      price: 0,
      type: "",
      id: "",
      isEditing: false,
    },
  ]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const fetchWorks = async () => {
    setLoading(true);
    const works = await getDocs(collection(db, "works"));
    const filteredWorks = works.docs.map((doc) => {
      return {
        ...(doc.data() as Omit<Work, "id">),
        id: doc.id,
        isEditing: false,
      };
    });
    // console.log(filteredWorks);
    setWorkList(filteredWorks);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // work post handler
  const workPostHander = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emptyFeilds = () => {
      setTitle("");
      setLocation("");
      setPrice("");
      setDescription("");
    };
    try {
      await addDoc(collection(db, "works"), {
        type: title,
        isDone: false,
        location,
        price,
        description,
      });
      emptyFeilds();
      fetchWorks();
    } catch (e) {
      console.error(e);
    }
  };

  // delete post
  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "works", id));
      setWorkList((p) => p.filter((w) => w.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // update post
  const updatePost = async (id: string) => {
    setWorkList((prev) =>
      prev.map((work) => (work.id === id ? { ...work, isEditing: true } : work))
    );

    try {
      await updateDoc(doc(db, "works", id), {});
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h1 style={{ textAlign: "center", margin: "2rem 0" }}>
        Firebase Tutorial
      </h1>
      <Auth />

      <h2 style={{ textAlign: "center" }}>CRUD operation</h2>

      {/* create */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "2rem",
          justifyContent: "center",
          alignItems: "center",
          background: "#1e1e1e",
        }}
      >
        <h3 style={{ color: "gold", textAlign: "center" }}>Create</h3>
        <form onSubmit={workPostHander} action="post" id="post-work">
          <div>
            <label htmlFor="title">Title: </label>
            <input
              value={title}
              onChange={(e) => setTitle(() => e.target.value)}
              type="text"
              name="title"
              id="title"
              placeholder="title"
            />
          </div>

          <div>
            <label htmlFor="location">Location: </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(() => e.target.value)}
              name="location"
              id="location"
              placeholder="Job location"
            />
          </div>

          <div>
            <label htmlFor="price">Price: </label>
            <input
              onChange={(e) => setPrice(() => e.target.value)}
              value={price}
              type="number"
              name="price"
              id="price"
              placeholder="How much will you pay for the job?"
            />
          </div>

          <div>
            <label htmlFor="description">Description: </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(() => e.target.value)}
              name="description"
              id="description"
              placeholder="Describe the job"
            />
          </div>

          <button style={{ background: "green" }} type="submit">
            Post work
          </button>
        </form>
      </div>

      {/* read */}
      {loading ? (
        "Fetching posts..."
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "2rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3 style={{ color: "gold" }}>Read</h3>
          {workList.map((work, index) => (
            <div
              key={index}
              style={{
                background: "#1e1e1e",
                color: "#fff",
                borderRadius: "12px",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "0.5rem",
                  color: "#646cff",
                  fontWeight: "bold",
                }}
              >
                {work.type.toUpperCase()}
              </h3>{" "}
              {work.isEditing == true ? (
                <input type="text" placeholder="Edit work title" />
              ) : (
                ""
              )}
              <p
                style={{
                  margin: "0.3rem 0",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                }}
              >
                {work.description}
              </p>
              <p
                style={{
                  margin: "0.3rem 0",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                }}
              >
                <strong>Location:</strong> {work.location}
              </p>
              <p
                style={{
                  margin: "0.3rem 0",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                }}
              >
                <strong>Status:</strong>{" "}
                {work.isDone ? "✅ Done" : "❌ Not done"}
              </p>
              <p
                style={{
                  marginTop: "0.8rem",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#53e653",
                }}
              >
                ₦{work.price.toLocaleString()}
              </p>
              <button
                style={{ background: "firebrick" }}
                onClick={() => deletePost(work.id)}
              >
                Delete work
              </button>
              <button
                style={{
                  marginLeft: "8px",
                  color: "green",
                  borderColor: "green",
                }}
                onClick={() => updatePost(work.id)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
