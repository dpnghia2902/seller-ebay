import React, { useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../services/authService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { register, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    await register(email, password, fullName);

    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");

    alert("Registration successful!");

    window.location.href = "/";
  };

  // Disable button if inputs invalid
  const isInvalid =
    !email || !password || !confirmPassword || !fullName || password !== confirmPassword;

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ width: "80%", maxWidth: "400px" }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "orange",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Register
        </h2>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
          onSubmit={handleSubmit}
        >
          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                ...inputStyle,
                border:
                  confirmPassword && confirmPassword !== password
                    ? "1px solid red"
                    : "1px solid #ccc",
              }}
              required
            />
            {confirmPassword && confirmPassword !== password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginTop: "4px",
                }}
              >
                Passwords do not match
              </motion.p>
            )}
          </div>

          {/* Error from auth service */}
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

          {/* Submit button */}
          <motion.button
            whileHover={!isInvalid ? { scale: 1.05 } : {}}
            whileTap={!isInvalid ? { scale: 0.95 } : {}}
            type="submit"
            disabled={isInvalid}
            style={{
              backgroundColor: isInvalid ? "#ccc" : "orange",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: isInvalid ? "not-allowed" : "pointer",
              boxShadow: isInvalid ? "none" : "0 4px 8px rgba(255,165,0,0.4)",
              transition: "all 0.3s ease",
            }}
          >
            Register
          </motion.button>

          <p style={{ fontSize: "14px", textAlign: "center" }}>
            Already have an account?{" "}
            <a
              href="/"
              style={{
                color: "orange",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}

// 🔸 Shared inline styles
const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "500",
  color: "orange",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outline: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};
