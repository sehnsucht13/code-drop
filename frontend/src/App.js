import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route } from "react-router-dom";

import HomePageContainer from "./components/HomePage/HomePageContainer";
import CodeDisplaycontainer from "./components/CodeDisplay/CodeDisplayContainer";
import ErrorContainer from "./components/Error/ErrorContainer";
import SearchContainer from "./components/SearchPage/SearchContainer";
import NewDropContainer from "./components/CodeEditor/NewDropContainer";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={HomePageContainer} exact />
        <Route path="/show" component={CodeDisplaycontainer} />
        <Route path="/new" component={NewDropContainer} />
        <Route path="/search" component={SearchContainer} />
        <Route path="/profile" component={ErrorContainer} />
        <Route component={ErrorContainer} />
      </Switch>
    </div>
  );
}

export default App;
