import React from "react";
import "./App.css";
import Header from "./Header";

function Forbidden() {
  return (
    <>
      <Header />
      <div className="bounds">
        <h1>Forbidden</h1>
        <p>Oh oh! You can't access this page.</p>
      </div>
    </>
  );
}

export default Forbidden;
