import React from "react";
import { Switch, Route } from "react-router-dom";
import AuthViews from "views/auth-views";

export const AuthRoutes = () => {
  return (
    <Switch>
      <Route path="" component={AuthViews} />
    </Switch>
  );
};

export default AuthRoutes;
