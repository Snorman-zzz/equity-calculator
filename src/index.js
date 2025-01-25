// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // Make sure you have a styles.css

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
