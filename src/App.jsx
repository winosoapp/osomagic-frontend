import React from "react";
import { EditorProvider } from "./context/EditorContext.jsx";
import LayoutRenderer from "./layout/LayoutRenderer.jsx";
import "./layout/layout.css";

const App = () => {
  return (
    <EditorProvider>
      <LayoutRenderer />
    </EditorProvider>
  );
};

export default App;
