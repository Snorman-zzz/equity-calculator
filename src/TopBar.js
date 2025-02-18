// TopBar.js
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function TopBar() {
    const navigate = useNavigate();
    const { workspaceId } = useParams();
    const currentWsId = workspaceId || 1;

    return (
        <div className="top-bar">
            <button onClick={() => navigate("/workspaces")}>Home</button>
            <button
                onClick={() => navigate(`/team-details/${currentWsId}`)}
                style={{ marginLeft: "8px" }}
            >
                Team
            </button>
            <button
                onClick={() => navigate(`/reports/${currentWsId}`)}
                style={{ marginLeft: "8px" }}
            >
                Report
            </button>
        </div>
    );
}

export default TopBar;
