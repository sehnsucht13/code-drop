import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route } from "react-router-dom";

import HomePageContainer from "./components/HomePage/HomePageContainer";
import CodeDisplaycontainer from "./components/CodeDisplay/CodeDisplayContainer";
import ErrorContainer from "./components/Error/ErrorContainer";
import SearchContainer from "./components/SearchPage/SearchContainer";
import NewDropContainer from "./components/CodeEditor/NewDropContainer";
import LoginContainer from "./components/Login/LoginContainer";
import RegisterContainer from "./components/Register/RegisterContainer";
import ProfileContainer from "./components/Profile/ProfileContainer";

function App() {
  return (
    <div className="App" style={{ height: "100%" }}>
      <Switch>
        <Route path="/" component={HomePageContainer} exact />
        <Route path="/view" component={CodeDisplaycontainer} />
        <Route path="/create" component={NewDropContainer} />
        <Route path="/search" component={SearchContainer} />
        <Route path="/profile" component={ProfileContainer} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/register" component={RegisterContainer} />
        <Route component={ErrorContainer} />
      </Switch>
    </div>
  );
}

export default App;
