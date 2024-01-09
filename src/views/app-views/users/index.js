import { Route, Switch, Redirect } from "react-router-dom";
import UserDashboard from "./dashboard";

const Users = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={UserDashboard} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Users;
