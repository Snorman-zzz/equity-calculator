// MinimalTopBar.js
import React from "react";
import { useNavigate } from "react-router-dom";

function MinimalTopBar() {
    const navigate = useNavigate();
    return (
        <div className="top-bar">
            <button onClick={() => navigate("/workspaces")}>Home</button>
        </div>
    );
}

export default MinimalTopBar;
