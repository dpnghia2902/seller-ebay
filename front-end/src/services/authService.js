import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE;

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            setError(null); // reset error

            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            // ✅ Extract token from backend
            const { accessToken } = response.data;

            // ✅ Decode JWT to get user info (userId, email, role)
            const payload = JSON.parse(atob(accessToken.split(".")[1]));

            // ✅ Store both user info and token in state/localStorage
            const userData = {
                email: payload.email,
                role: payload.role,
                userId: payload.userId,
                accessToken,
            };

            setUser(userData);
            localStorage.setItem("authUser", JSON.stringify(userData));

            // ✅ Redirect based on role
            if (payload.role === "admin") {
                navigate("/admin");
            } else if (payload.role === "seller") {
                navigate("/dashboard");
            } else {
                navigate("/homepage");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Đăng nhập thất bại");
            } else {
                setError("Không thể kết nối đến máy chủ");
            }
            console.error(error);
        }
    };

    const register = async (email, password, name) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                name,
            });

            const { accessToken } = response.data;
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            const userData = {
                email: payload.email,
                role: payload.role,
                userId: payload.userId,
                accessToken,
            };

            setUser(userData);
            localStorage.setItem("authUser", JSON.stringify(userData));

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Đăng ký thất bại");
            } else {
                setError("Không thể kết nối đến máy chủ");
            }
            console.error(error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("authUser");
        navigate("/login");
    };

    return { user, error, login, register, logout };
};

export default useAuth;
