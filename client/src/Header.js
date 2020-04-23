import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { GlobalStateContext } from "./Context";

function Header() {
  const context = useContext(GlobalStateContext);
  const loggedInUser = context.authenticateduser.get;
  const isAuth = context.isAuthenticated.get;
  return (
    <>
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo">Courses</h1>
          <nav>
            {isAuth && (
              <span>
                {" "}
                Welcome {loggedInUser.firstName} {loggedInUser.lastName}!{" "}
              </span>
            )}

            {isAuth && (
              <Link className="signup" to="/signout">
                Sign Out
              </Link>
            )}

            {!isAuth && (
              <Link className="signup" to="/signup">
                Sign Up
              </Link>
            )}

            {!isAuth && (
              <Link className="signin" to="/signin">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
      <hr />
    </>
  );
}

export default Header;
