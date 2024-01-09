import { Route, Switch, Redirect } from "react-router-dom";
import Admin from "./admin";
import Users from "./users";

const AppViews = ({ match }) => {
  const userType = localStorage.getItem("userType");
  return (
    <>
      <Switch>
        <Route path={`/`} component={userType === "Admin" ? Admin : Users} />
        <Redirect to="/not-found" />
      </Switch>
    </>
  );
};

export default AppViews;
