import React, { useContext } from "react";
import "./App.css";
import Header from "./Header";
import { withRouter } from "react-router";
import { GlobalStateContext } from "./Context";

function UserSignOut(props) {
  const context = useContext(GlobalStateContext);
  const SignOut = () => {
    context.signOut();
    props.history.push("/signin");
  };

  return (
    <GlobalStateContext.Consumer>
      {() => (
        <>
          <Header />
          <div className="bounds">
            <h1>Sign Out</h1>
            <p>Are u sure you want to sign out? </p>
            <button className="button" type="button" onClick={() => SignOut()}>
              Sign Out
            </button>
          </div>
        </>
      )}
    </GlobalStateContext.Consumer>
  );
}

export default withRouter(UserSignOut);
