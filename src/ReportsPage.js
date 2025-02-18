// ReportsPage.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import { Pie } from "react-chartjs-2";
import TopBar from "./TopBar";
import "./styles.css";

function ReportsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { workspaceId } = useParams();
    const { getWorkspaceById } = useTeamContext();

    const workspace = getWorkspaceById(workspaceId);
    if (!workspace) {
        return (
            <div className="wrapper">
                <TopBar />
                <h1>Workspace not found!</h1>
            </div>
        );
    }

    const {
        format,
        reservedPools = [],
        areas = [],
        intangibleFactors = [],
        members = [],
    } = workspace;

    // Filter members by search term
    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // -----------------------------
    // CHART DATA
    // -----------------------------

    // 1) "By Project" chart: reservedPools + areas + intangibleFactors
    const chartLabels = [
        ...reservedPools.map((p) => p.name),
        ...areas.map((a) => a.name),
        ...intangibleFactors.map((f) => f.name),
    ];
    const chartValues = [
        ...reservedPools.map((p) => p.weight),
        ...areas.map((a) => a.weight),
        ...intangibleFactors.map((f) => f.weight),
    ];
    const projectData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartValues,
                backgroundColor: [
                    "#8b5cf6",
                    "#a78bfa",
                    "#ef4444",
                    "#f97316",
                    "#f59e0b",
                    "#84cc16",
                    "#22c55e",
                    "#14b8a6",
                    "#3b82f6",
                    "#ec4899",
                    "#a855f7",
                    "#f43f5e",
                    "#10b981",
                    "#0ea5e9",
                    "#d946ef",
                ].slice(0, chartLabels.length),
            },
        ],
    };

    // 2) "By Team Member (Equity)" chart: each member's total + the reservedPools
    const combinedLabels = [
        ...members.map((m) => m.name),
        ...reservedPools.map((rp) => rp.name),
    ];
    const combinedValues = [
        ...members.map((m) => m.totalEquity),
        ...reservedPools.map((rp) => rp.weight),
    ];
    const memberData = {
        labels: combinedLabels,
        datasets: [
            {
                data: combinedValues,
                backgroundColor: [
                    "#f97316",
                    "#f59e0b",
                    "#84cc16",
                    "#22c55e",
                    "#14b8a6",
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                    "#a855f7",
                    "#f43f5e",
                    "#2dd4bf",
                    "#eab308",
                    "#6366f1",
                    "#ef4444",
                    "#14b8a6",
                ].slice(0, combinedLabels.length),
            },
        ],
    };

    // -----------------------------
    // TABLE & CSV
    // -----------------------------
    // Combine reservedPools, areas, intangibleFactors as columns in the main table
    const tableLabels = [
        ...reservedPools.map((rp) => rp.name),
        ...areas.map((a) => a.name),
        ...intangibleFactors.map((f) => f.name),
    ];

    function exportToCSV() {
        let csv = "Team Member,";
        tableLabels.forEach((header) => {
            csv += `${header},`;
        });
        csv += "Total Equity\n";

        filteredMembers.forEach((m) => {
            csv += `${m.name},`;
            tableLabels.forEach((lbl) => {
                // For reserved pools, members typically have 0 contribution
                const val = m.contributions[lbl] || 0;
                csv += `${val}%,`;
            });
            csv += `${m.totalEquity}%\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "team_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // -----------------------------
    // AI REPORT FEATURE
    // -----------------------------
    const [aiReport, setAiReport] = useState("");
    const [loadingReport, setLoadingReport] = useState(false);

    async function generateAIReport() {
        // Build breakdown strings from workspace data
        const contributionBreakdown = areas
            .map((a) => `${a.name}: ${a.weight}%`)
            .join("\n");

        const intangibleBreakdown = intangibleFactors
            .map((f) => `${f.name}: ${f.weight}%`)
            .join("\n");

        const teamBreakdown = members
            .map((m) => {
                const contribs = Object.entries(m.contributions)
                    .map(([key, val]) => `  ${key}: ${val}%`)
                    .join("\n");
                return `${m.name}:\n${contribs}`;
            })
            .join("\n");

        const reservedBreakdown = reservedPools
            .map((rp) => `${rp.name}: ${rp.weight}%`)
            .join("\n");

        console.log("Reserved Breakdown:", reservedBreakdown);
        console.log("contributionBreakdown:", contributionBreakdown);
        console.log("intangibleBreakdown:", intangibleBreakdown);

        // You can change this question or let users type their own
        const question = "What is the total equity for each team member?";

        const prompt = `Using the following equity breakdowns, calculate the answer to the question.

Equity breakdown by contribution areas:
${reservedBreakdown}
${contributionBreakdown}
${intangibleBreakdown}

Equity breakdown by team member:
${teamBreakdown}

Question: ${question}

Hint: Just add up Equity breakdown by team member for each member.

Please provide a detailed explanation along with the final total equity for each team member.
`;

        console.log("Prompt:", prompt);

        setLoadingReport(true);
        setAiReport("");

        try {
            const response = await fetch("http://localhost:5001/api/generate-ai-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
                throw new Error("API request failed");
            }
            const data = await response.json();
            setAiReport(data.answer);
        } catch (error) {
            console.error("Error generating AI report:", error);
            setAiReport("Error generating AI report. Please try again later.");
        }
        setLoadingReport(false);
    }

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <div className="wrapper">
            <TopBar />
            <h1>Reports Page (Workspace #{workspaceId})</h1>
            <h2>{format || "Company / Format"}</h2>

            <div className="section" style={{ marginBottom: "1rem" }}>
                <div style={{ marginBottom: "8px", display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={exportToCSV}>Export to CSV</button>
                </div>

                {/* Main Table with Reserved Pools + Areas + Intangibles as columns */}
                <table>
                    <thead>
                    <tr>
                        <th>Team Member</th>
                        {tableLabels.map((lbl) => (
                            <th key={lbl}>{lbl}</th>
                        ))}
                        <th>Total Equity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMembers.map((m) => (
                        <tr key={m.id}>
                            <td>{m.name}</td>
                            {tableLabels.map((lbl) => (
                                <td key={lbl}>{(m.contributions[lbl] || 0) + "%"}</td>
                            ))}
                            <td>{m.totalEquity}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* AI Report */}
                <div style={{ marginTop: "2rem" }}>
                    <button onClick={generateAIReport}>
                        {loadingReport ? "Generating Report..." : "Generate AI Report"}
                    </button>
                    {aiReport && (
                        <div
                            style={{
                                marginTop: "1rem",
                                padding: "1rem",
                                backgroundColor: "#f9f9f9",
                                borderRadius: "6px",
                                overflowY: "auto",
                            }}
                        >
                            <h3>AI Report</h3>
                            <pre style={{ whiteSpace: "pre-wrap" }}>{aiReport}</pre>
                        </div>
                    )}
                </div>
            </div>

            <div className="section reports-charts-container">
                <div className="chart-container">
                    <h3>By Project (Reserved + Areas + Factors)</h3>
                    <div style={{ height: "300px" }}>
                        <Pie data={projectData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="chart-container">
                    <h3>By Team Member (Equity)</h3>
                    <div style={{ height: "300px" }}>
                        <Pie data={memberData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportsPage;