import { Switch, Route } from "react-router-dom";
import AppViews from "views/app-views";

export const AppRoutes = () => {
  return (
    <>
      <Switch>
        <Route path="" component={AppViews} />
      </Switch>
    </>
  );
};

export default AppRoutes;
