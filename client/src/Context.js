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

  const store = {
    authenticateduser: { get: authenticateduser, set: setAuthenticateduser },
    isAuthenticated: { get: isAuthenticated, set: setIsAuthenticated },
    courses: { get: courses, set: setCourses },
  };

  return (
    <GlobalStateContext.Provider value={store}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
