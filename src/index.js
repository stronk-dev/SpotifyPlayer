import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./shared.css";

const renderApp = () => {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<App />);
};

(async () => renderApp())();
