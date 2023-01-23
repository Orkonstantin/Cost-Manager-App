
import React from "react";
import CostManager from "./CostManager";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
      <div className="container">
        <ErrorBoundary>
          <CostManager/>
        </ErrorBoundary>
      </div>
  );
}
export default App;