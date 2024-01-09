import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import AppRoutes from "routes/app-routes";
import AuthRoutes from "routes/auth-routes";
function PrivateRoute({ children, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/auth/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
export const Views = (props) => {
  const { location } = props;
  const isAuthenticated =
    localStorage.getItem("token") === null ||
    localStorage.getItem("token") === "" ||
    localStorage.getItem("token") === undefined
      ? false
      : true;
  // const isAuthenticated = true;

  return (
    <Switch>
      <Route path="/auth">
        <AuthRoutes />
      </Route>
      <PrivateRoute path="/" isAuthenticated={isAuthenticated}>
        <AppRoutes location={location} />
      </PrivateRoute>
    </Switch>
  );
};

export default withRouter(Views);
