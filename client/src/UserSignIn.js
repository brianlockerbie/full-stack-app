import React, { useState, useContext } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import { GlobalStateContext } from "./Context";

const UserSignIn = (props) => {
  const context = useContext(GlobalStateContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMesage] = useState("");

  const Authenticate = () => {
    let base64 = require("base-64");
    let url = "http://localhost:5000/api/users";
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          // update the user information from the global store once they sign in
          context.authenticateduser.set({
            email: email,
            password: password,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          });
          context.isAuthenticated.set(true);

          props.history.push("/courses");
        } else {
          setMesage("Email Address or Password is incorrect.");
        }
      });
  };

  return (
    <GlobalStateContext.Consumer>
      {() => (
        <React.Fragment>
          <div id="root">
            <Header />
            <div className="bounds">
              <div className="grid-33 centered signin">
                <h1>User Sign In</h1>
                <div>
                  <form>
                    <div>
                      <input
                        id="emailAddress"
                        name="emailAddress"
                        type="text"
                        className=""
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className=""
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid-100 pad-bottom">
                      <button
                        className="button"
                        type="button"
                        onClick={() => Authenticate()}
                      >
                        Sign In
                      </button>
                      <button
                        className="button button-secondary"
                        onClick={() => props.history.push("/courses")}
                      >
                        Cancel
                      </button>
                    </div>
                    {message && <p style={{ color: "red" }}>{message}</p>}
                  </form>
                </div>
                <p>&nbsp;</p>
                <p>
                  Don't have a user account?{" "}
                  <Link to="/signup">Click here</Link> to sign up!
                </p>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </GlobalStateContext.Consumer>
  );
};

export default withRouter(UserSignIn);
