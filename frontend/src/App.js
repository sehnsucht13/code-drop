import BlockCodeView from "./components/BlockCode";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import DropEditor from "./components/CodeDropEditor";
import AnnotationContainer from "./components/AnnotationContainer";

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

function App() {
  return (
    <div className="App">
      <Container>
        <DropEditor />
        <AnnotationContainer />
      </Container>
    </div>
  );
}

export default App;
