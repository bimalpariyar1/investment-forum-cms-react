import { Route, Switch, Redirect } from "react-router-dom";
import About from "./about";
import Agenda from "./agenda";
import AddAgenda from "./agenda/add-agenda";
import EditAgenda from "./agenda/edit-agenda";
import HomePage from "./homepage";
import Navigations from "./navigations";
import PanelDiscussion from "./panel-discussion";
import AddSpeaker from "./panel-discussion/add-speaker";
import EditSpeaker from "./panel-discussion/edit-speaker";
import Sponsors from "./sponsors";
import UserDetails from "./user-deails";
import UsersList from "./users-list";
import Resources from "./resources";
import Statistics from "./statistics";
const Admin = ({ match }) => {
  return (
    <div>
      <Switch>
        <Route exact path={`${match.url}`} component={UsersList} />
        <Route exact path={`${match.url}homepage`} component={HomePage} />
        <Route exact path={`${match.url}about`} component={About} />
        <Route exact path={`${match.url}agenda`} component={Agenda} />
        <Route exact path={`${match.url}add-agenda`} component={AddAgenda} />
        <Route
          exact
          path={`${match.url}edit-agenda/:id`}
          component={EditAgenda}
        />
        <Route
          exact
          path={`${match.url}panel-discussion`}
          component={PanelDiscussion}
        />
        <Route exact path={`${match.url}add-speaker`} component={AddSpeaker} />
        <Route
          exact
          path={`${match.url}edit-speaker/:id`}
          component={EditSpeaker}
        />
        <Route exact path={`${match.url}sponsors`} component={Sponsors} />
        <Route exact path={`${match.url}nav`} component={Navigations} />
        <Route exact path={`${match.url}statistics`} component={Statistics} />
        <Route exact path={`${match.url}resources`} component={Resources} />
        <Route
          exact
          path={`${match.url}user-details/:id`}
          component={UserDetails}
        />
        <Redirect to="not-found" />
      </Switch>
    </div>
  );
};

export default Admin;
