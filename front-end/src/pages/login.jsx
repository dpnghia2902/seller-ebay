import React from "react";

export default function Login() {
    return (
        <div style={{ height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
            {/* navBar */}
            <div
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
                    <a
                        href="#"
                        style={{ textDecoration: "none", color: "white", fontWeight: "500" }}
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        style={{ textDecoration: "none", color: "white", fontWeight: "500" }}
                    >
                        About Us
                    </a>
                </div>
            </div>

            {/* Background image */}
            <img
                src="/login_img.png"
                alt="Login"
                style={{
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover",
                }}
            />

            {/* Login form container */}
            <div
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
                <div style={{ width: "80%", maxWidth: "400px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "orange", marginBottom: "20px" }}>
                        Login
                    </h2>
                    <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "orange" }}>
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    outline: "none",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "orange" }}>
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    outline: "none",
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: "orange",
                                color: "white",
                                padding: "12px",
                                border: "none",
                                borderRadius: "5px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Login
                        </button>
                        <p style={{ fontSize: "14px", textAlign: "center" }}>
                            Don’t have an account?{" "}
                            <a href="#" style={{ color: "orange", fontWeight: "500" }}>
                                Register
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
