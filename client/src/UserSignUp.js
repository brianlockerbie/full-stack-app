import React, { useState, useContext } from "react";
import "./App.css";
import { withRouter } from "react-router";
import Header from "./Header";
import { GlobalStateContext } from "./Context";

function UserSignUp(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedpassword, setConfirmedpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const context = useContext(GlobalStateContext);

  const CreateUser = () => {
    let url = "http://localhost:5000/api/user";
    if (confirmedpassword !== password) {
      setErrorMessage("Password and confirmed password does not match.");
      return;
    }
    const user = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: email,
      password: password,
    };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          setErrorMessage(json.message);
        } else {
          setErrorMessage("");
          // update the user from the global state once they sign up
          context.authenticateduser.set({
            email: json.createduser.emailAddress,
            password: password,
            userId: json.createduser.id,
            firstName: json.createduser.firstName,
            lastName: json.createduser.lastName,
          });
          context.isAuthenticated.set(true);
          props.history.push("/courses");
        }
      });
  };

  return (
    <GlobalStateContext.Consumer>
      {() => (
        <>
          <Header />
          <div className="bounds">
            <div className="grid-33 centered UserSignUp">
              <h1>User Sign Up</h1>
              <div>
                <form>
                  <div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className=""
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className=""
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
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
                  <div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className=""
                      placeholder="Confirm Password"
                      value={confirmedpassword}
                      onChange={(e) => setConfirmedpassword(e.target.value)}
                    />
                  </div>
                  <div className="grid-100 pad-bottom">
                    <button
                      className="button"
                      type="button"
                      onClick={() => CreateUser()}
                    >
                      User Sign Up
                    </button>
                    <button
                      className="button button-secondary"
                      onClick={() => props.history.push("/courses")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </div>
              <p>&nbsp;</p>
              <p>
                Already have a user account?{" "}
                <a href="user-sign-in.html">Click here</a> to sign in!
              </p>
            </div>
          </div>
        </>
      )}
    </GlobalStateContext.Consumer>
  );
}

export default withRouter(UserSignUp);
