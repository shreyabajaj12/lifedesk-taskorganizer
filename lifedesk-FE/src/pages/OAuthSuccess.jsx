import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    useEffect(() => {
        const handleOAuthSuccess = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                localStorage.setItem("token", token);

                // Update AuthContext user state
                await refreshUser();

                // Now go to dashboard
                navigate("/", { replace: true });

            } catch (error) {
                console.error("OAuth login failed:", error);

                localStorage.removeItem("token");
                navigate("/login", { replace: true });
            }
        };

        handleOAuthSuccess();
    }, [navigate, refreshUser]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Signing you in...</p>
        </div>
    );
};

export default OAuthSuccess;