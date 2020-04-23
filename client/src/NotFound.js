import React from "react";
import Header from "./Header";
import "./App.css";

function NotFound() {
  return (
    <>
      <Header />
      <div className="bounds">
        <h1>Not Found</h1>
        <p>Sorry! We couldn't find the page you're looking for.</p>
      </div>
    </>
  );
}

export default NotFound;
