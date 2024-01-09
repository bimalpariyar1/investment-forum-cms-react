import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Views from "./views";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" component={Views} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
