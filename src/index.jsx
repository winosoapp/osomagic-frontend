import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

// ❗ Solución: eliminar StrictMode porque duplica renders en desarrollo
root.render(
  <App />
);
