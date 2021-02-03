import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route } from "react-router-dom";

import HomePageContainer from "./components/HomePage/HomePageContainer";
import CodeDisplaycontainer from "./components/CodeDisplay/CodeDisplayContainer";
import ErrorContainer from "./components/Error/ErrorContainer";
import SearchContainer from "./components/SearchPage/SearchContainer";
import NewDropContainer from "./components/CodeEditor/NewDropContainer";
import LoadingPage from "./components/Loading/LoadingPage";
import LoginContainer from "./components/Login/LoginContainer";

function App() {
  return (
    <div className="App" style={{ height: "100%" }}>
      <Switch>
        <Route path="/" component={HomePageContainer} exact />
        <Route path="/view" component={CodeDisplaycontainer} />
        <Route path="/create" component={NewDropContainer} />
        <Route path="/search" component={SearchContainer} />
        <Route path="/profile" component={LoadingPage} />
        <Route path="/login" component={LoginContainer} />
        <Route component={ErrorContainer} />
      </Switch>
    </div>
  );
}

export default App;
