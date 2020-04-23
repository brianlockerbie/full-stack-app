import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import UserSignIn from "./UserSignIn";
import UserSignUp from "./UserSignUp";
import Courses from "./Courses";
import NotFound from "./NotFound";
import CourseDetail from "./CourseDetail";
import Forbidden from "./Forbidden";
import CreateCourse from "./CreateCourse";
import UpdateCourse from "./UpdateCourse";
import PrivateRoute from "./PrivateRoute";
import UserSignOut from "./UserSignOut";
import GlobalStateProvider from "./Context.js";

const App = () => {
  return (
    <GlobalStateProvider>
      <Fragment>
        <Switch>
          <Route exact path="/" render={() => <Courses />} />
          <Route exact path="/signin" render={() => <UserSignIn />} />
          <Route exact path="/signup" render={() => <UserSignUp />} />
          <Route exact path="/signout" render={() => <UserSignOut />} />
          <PrivateRoute
            component={CreateCourse}
            path="/courses/create"
          ></PrivateRoute>
          <Route component={Courses} exact path="/courses"></Route>
          <Route component={CourseDetail} exact path="/courses/:id"></Route>
          <PrivateRoute
            component={UpdateCourse}
            exact
            path={"/courses/:id/update"}
          ></PrivateRoute>

          <Route exact path="/forbidden" component={Forbidden} />
          <Route render={() => <NotFound />} />
        </Switch>
      </Fragment>
    </GlobalStateProvider>
  );
};

export default App;
