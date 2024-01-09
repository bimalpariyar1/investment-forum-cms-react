import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
const AuthViews = ({ match }) => {
  return (
    <>
      <Switch>
        <Route path={`${match.url}`} component={Login} />
      </Switch>
    </>
  );
};

export default AuthViews;
