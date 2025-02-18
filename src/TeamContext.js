import React, { createContext, useContext, useState, useEffect } from "react";

const TeamContext = createContext();

// Helpers to load/save from localStorage
function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem("TEAM_DATA");
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Error reading from localStorage", err);
        return null;
    }
}

function saveToLocalStorage(workspaces) {
    try {
        const data = { workspaces };
        localStorage.setItem("TEAM_DATA", JSON.stringify(data));
    } catch (err) {
        console.error("Error writing to localStorage", err);
    }
}

export function TeamProvider({ children }) {
    const storedData = loadFromLocalStorage();
    const [workspaces, setWorkspaces] = useState(
        storedData?.workspaces ?? [
            {
                id: 1,
                name: "Default Workspace",
                format: "",
                reservedPools: [],
                areas: [],
                intangibleFactors: [],
                members: [],
            },
        ]
    );

    useEffect(() => {
        saveToLocalStorage(workspaces);
    }, [workspaces]);

    function getWorkspaceById(wsId) {
        return workspaces.find((ws) => ws.id === Number(wsId));
    }

    function addWorkspace(name) {
        const newId = workspaces.length + 1;
        const newWs = {
            id: newId,
            name,
            format: "",
            reservedPools: [],
            areas: [],
            intangibleFactors: [],
            members: [],
        };
        setWorkspaces((prev) => [...prev, newWs]);
        return newWs;
    }

    function updateWorkspace(wsId, updatedWs) {
        setWorkspaces((prev) =>
            prev.map((ws) => (ws.id === Number(wsId) ? updatedWs : ws))
        );
    }

    // Calculate the total equity for a single member
    function calculateTotalEquity(contributions) {
        return Object.values(contributions).reduce((sum, val) => sum + val, 0);
    }

    // Returns how much is left in a given area/factor (excluding a member if needed)
    function getRemainingForArea(workspace, areaName, excludeMemberId) {
        const foundArea =
            workspace.areas.find((a) => a.name === areaName) ||
            workspace.intangibleFactors.find((f) => f.name === areaName);

        const poolTotal = foundArea ? foundArea.weight : 0;

        const sumContributions = workspace.members.reduce((acc, mem) => {
            if (excludeMemberId && mem.id === excludeMemberId) return acc;
            return acc + (mem.contributions[areaName] || 0);
        }, 0);

        return Math.max(0, poolTotal - sumContributions);
    }

    return (
        <TeamContext.Provider
            value={{
                workspaces,
                getWorkspaceById,
                addWorkspace,
                updateWorkspace,
                calculateTotalEquity,
                getRemainingForArea,
            }}
        >
            {children}
        </TeamContext.Provider>
    );
}

export function useTeamContext() {
    return useContext(TeamContext);
}
