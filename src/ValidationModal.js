// ValidationModal.js
import React from "react";
import { useTeamContext } from "./TeamContext";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function ValidationModal({ onClose, workspaceId }) {
    const navigate = useNavigate();
    const { getWorkspaceById } = useTeamContext();

    const workspace = getWorkspaceById(workspaceId);
    if (!workspace) return null;

    const {
        format,
        reservedPools = [],
        areas = [],
        intangibleFactors = [],
        members = [],
    } = workspace;

    const errors = [];

    // 1) Must have >= 1 member
    if (members.length === 0) {
        errors.push("Your team must have at least 1 member (currently 0).");
    }

    // 2) Check total = 100
    const sumReserved = reservedPools.reduce((acc, r) => acc + r.weight, 0);
    const sumAreas = areas.reduce((acc, a) => acc + a.weight, 0);
    const sumFactors = intangibleFactors.reduce((acc, f) => acc + f.weight, 0);
    const totalAllocation = sumReserved + sumAreas + sumFactors;
    if (totalAllocation !== 100) {
        errors.push(`Total allocation must be 100%. Got: ${totalAllocation}%.`);
    }

    // 3) No category is zero
    reservedPools.forEach((rp) => {
        if (rp.weight === 0) {
            errors.push(`Reserved Pool "${rp.name}" has 0%. Must be > 0%.`);
        }
    });
    areas.forEach((a) => {
        if (a.weight === 0) {
            errors.push(`Area "${a.name}" has 0%. Must be > 0%.`);
        }
    });
    intangibleFactors.forEach((f) => {
        if (f.weight === 0) {
            errors.push(`Intangible Factor "${f.name}" has 0%. Must be > 0%.`);
        }
    });

    // 4) Over-allocation check for each area/factor
    areas.forEach((area) => {
        const sumAreaContrib = members.reduce((acc, m) => acc + (m.contributions[area.name] || 0), 0);
        if (sumAreaContrib > area.weight) {
            errors.push(
                `Area "${area.name}" is over-allocated by ${sumAreaContrib - area.weight}%.`
            );
        }
    });
    intangibleFactors.forEach((factor) => {
        const sumFactorContrib = members.reduce((acc, m) => acc + (m.contributions[factor.name] || 0), 0);
        if (sumFactorContrib > factor.weight) {
            errors.push(
                `Intangible Factor "${factor.name}" is over-allocated by ${sumFactorContrib - factor.weight}%.`
            );
        }
    });

    // 5) No member with zero total equity
    members.forEach((m) => {
        const totalForM = Object.values(m.contributions).reduce((a, b) => a + b, 0);
        if (totalForM === 0) {
            errors.push(`${m.name} has no equity allocations at all.`);
        }
    });

    // 6) Team's total vs reserved
    const totalTeamEquity = members.reduce((acc, mem) => {
        return acc + Object.values(mem.contributions).reduce((sub, val) => sub + val, 0);
    }, 0);
    const expectedTeamEquity = 100 - sumReserved;
    if (Math.abs(totalTeamEquity - expectedTeamEquity) > 0.01) {
        if (totalTeamEquity > expectedTeamEquity) {
            errors.push(`Total team equity is over by ${(totalTeamEquity - expectedTeamEquity).toFixed(2)}%.`);
        } else {
            errors.push(`Total team equity is under by ${(expectedTeamEquity - totalTeamEquity).toFixed(2)}%.`);
        }
    }

    // 7) No member should allocate from reservedPools
    reservedPools.forEach((rp) => {
        members.forEach((m) => {
            if (m.contributions[rp.name] && m.contributions[rp.name] > 0) {
                errors.push(
                    `Member "${m.name}" is allocating from Reserved Pool "${rp.name}", which is not allowed.`
                );
            }
        });
    });

    const isValid = errors.length === 0;

    function handleOK() {
        onClose();
    }
    function handleViewReport() {
        onClose();
        navigate(`/reports/${workspaceId}`);
    }

    return (
        <div className="validation-modal">
            {!isValid ? (
                <>
                    <h2>Your team was rejected for the following reasons:</h2>
                    <ul>
                        {errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                    <button onClick={handleOK}>OK</button>
                </>
            ) : (
                <>
                    <h2>Your team is valid for {format || "the chosen format"}.</h2>
                    <button onClick={handleOK}>OK</button>
                    <button onClick={handleViewReport} style={{ marginLeft: "8px" }}>
                        Print/View Report
                    </button>
                </>
            )}
        </div>
    );
}

export default ValidationModal;
