import "bootstrap/dist/css/bootstrap.min.css";

import NewDropContainer from "./components/NewDropContainer";
import HomePageContainer from "./components/HomePageContainer";
import ErrorContainer from "./components/ErrorContainer";
import { Switch, Route } from "react-router-dom";

const axios = require("axios");

const testLang = `print("hello world")
class help:
  def __init__(self, hello):
    g = 4 + 4
    return 14`;

const annotationData = {
  a: "# Hello from a ",
  b: "## Hello from b",
};

const codeSpanData = {
  0: "a",
  1: "a",
  3: "b",
};

// <Navbar />
// <Container style={{ paddingTop: "5%" }}>
//   <DropEditor />
//   <AnnotationContainer />
// </Container>

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={HomePageContainer} exact />
        <Route path="/new" component={NewDropContainer} />
        <Route path="/explore" component={null} />
        <Route path="/profile" component={null} />
        <Route component={ErrorContainer} />
      </Switch>
    </div>
  );
}

export default App;
