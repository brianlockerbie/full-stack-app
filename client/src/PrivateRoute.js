import React, { useContext } from "react";
import { Route } from "react-router-dom";
import Forbidden from "./Forbidden";
import { GlobalStateContext } from "./Context";

const PrivateRoute = ({ component, ...options }) => {
  const context = useContext(GlobalStateContext);
  const isAuth = context.isAuthenticated.get;
  const LastComponent = isAuth === true ? component : Forbidden;
  return <Route {...options} component={LastComponent} />;
};

export default PrivateRoute;
