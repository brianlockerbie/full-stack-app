import React from "react";
import { useState } from "react";

export const GlobalStateContext = React.createContext();

/* GlobalStateProvider :
 a component used to persist the authenticated user information in a global state-full component.
*/
const GlobalStateProvider = (props) => {
  const [authenticateduser, setAuthenticateduser] = useState({
    firstName: "Brian",
  });
  // a boolean indicating whether the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [courses, setCourses] = useState([]);
  
  // signIn: globally availabe method allowing the user to signIn
  // callback: extra parameter to handle redirection of routes once API call (fetch request)
  // completes
  const signIn = (email, password, callback = () => {}) => {
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
          setAuthenticateduser({
            email: email,
            password: password,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          });
          setIsAuthenticated(true);
          callback(true);
        } else {
          callback(false);
        }
      });
  };
  
  // signOut: globally availabe method allowing the user to signOut
  const signOut = () => {
    // clear the user from the global store once they sign out
    setAuthenticateduser({
      email: "",
      password: "",
      userId: 0,
      firstName: "",
      lastName: "",
    });
    // set isAuthenticated to false once they log out
    setIsAuthenticated(false);
  };
  
  const store = {
    authenticateduser: { get: authenticateduser, set: setAuthenticateduser },
    isAuthenticated: { get: isAuthenticated, set: setIsAuthenticated },
    courses: { get: courses, set: setCourses },
    signIn: signIn,
    signOut: signOut,
  };

  return (
    <GlobalStateContext.Provider value={store}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
