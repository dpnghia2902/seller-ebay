import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../services/authService";
import Register from "../components/registerForm";

export default function Login() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pageState, setPageState] = useState("login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    setEmail("");
    setPassword("");
    window.location.href = "/homepage";
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* NavBar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50px",
          backgroundColor: "orange",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            fontSize: "25px",
            margin: "0 20px",
            color: "white",
          }}
        >
          FSShop
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#" style={{ textDecoration: "none", color: "white", fontWeight: "500" }}>
            Home
          </a>
          <a href="#" style={{ textDecoration: "none", color: "white", fontWeight: "500" }}>
            About Us
          </a>
        </div>
      </motion.div>

      {/* Background Image */}
      <motion.img
        src="/login_img.png"
        alt="Login Background"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
        }}
      />

      {/* Animated Page Switch */}
      <AnimatePresence mode="wait">
        {pageState === "login" && (
          <motion.div
            key="login"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "-4px 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ width: "80%", maxWidth: "400px" }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "orange",
                  marginBottom: "20px",
                }}
              >
                Login
              </h2>

              <form
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                      color: "orange",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      outline: "none",
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                      color: "orange",
                    }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      outline: "none",
                    }}
                    required
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      color: "red",
                      fontSize: "14px",
                      textAlign: "center",
                      marginTop: "-5px",
                    }}
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    padding: "12px",
                    border: "none",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(255,165,0,0.4)",
                  }}
                >
                  Login
                </motion.button>

                <p style={{ fontSize: "14px", textAlign: "center" }}>
                  Don’t have an account?{" "}
                  <a
                    onClick={() => setPageState("register")}
                    style={{ color: "orange", fontWeight: "500", cursor: "pointer" }}
                  >
                    Register
                  </a>
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}

        {pageState === "register" && (
          <motion.div
            key="register"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
          >
            <Register />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
