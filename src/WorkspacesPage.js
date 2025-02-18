// WorkspacesPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import MinimalTopBar from "./MinimalTopBar";

function WorkspacesPage() {
    const navigate = useNavigate();
    const { workspaces, addWorkspace } = useTeamContext();

    function handleAddWorkspace() {
        const name = prompt("Workspace name?");
        if (name) {
            const newWs = addWorkspace(name);
            navigate(`/team-details/${newWs.id}`);
        }
    }

    function handleOpenWorkspace(wsId) {
        navigate(`/team-details/${wsId}`);
    }

    return (
        <div className="wrapper">
            <h1>Workspaces</h1>

            <div className="section">
                <h2>Your Workspaces</h2>
                {workspaces.map((ws) => (
                    <div key={ws.id} style={{ marginBottom: "8px" }}>
                        <button
                            style={{ backgroundColor: "#333", marginRight: "8px", color: "#fff" }}
                            onClick={() => handleOpenWorkspace(ws.id)}
                        >
                            {ws.name}
                        </button>
                    </div>
                ))}

                <button onClick={handleAddWorkspace}>+ Add Workspace</button>
            </div>
        </div>
    );
}

export default WorkspacesPage;
