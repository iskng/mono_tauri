import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../../../packages/ui/src/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
