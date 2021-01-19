import BlockCodeView from "./components/BlockCode";
const testLang = `print("hello world")
class help:
  def __init__(self, hello):
    g = 4 + 4
    return 14
    `;

function App() {
  return (
    <div className="App">
      <BlockCodeView codeString={testLang} language="python" />
    </div>
  );
}

export default App;
