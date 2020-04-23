import React, { useContext } from "react";
import "./App.css";
import Header from "./Header";
import { withRouter } from "react-router";
import { GlobalStateContext } from "./Context";

function UserSignOut(props) {
  const context = useContext(GlobalStateContext);
  console.log(context);

  const SignOut = () => {
    // clear the user from the global store once they sign out
    context.authenticateduser.set({
      email: "",
      password: "",
      userId: 0,
      firstName: "",
      lastName: "",
    });
    // set isAuthenticated to false once they log out
    context.isAuthenticated.set(false);

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
