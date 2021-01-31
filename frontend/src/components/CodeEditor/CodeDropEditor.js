import React, { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { Form, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { sendDrop } from "../../actions/annotation_actions";
import CodeMirrorLanguages from "../../helpers/CodeMirrorLanguages";

require("codemirror");
require("codemirror/lib/codemirror.css");

// TODO: How to split these into new file? Can they be loaded on demand?

import("codemirror/mode/apl/apl.js");
import("codemirror/mode/asciiarmor/asciiarmor.js");
import("codemirror/mode/markdown/markdown.js");
import("codemirror/mode/asn.1/asn.1.js");
import("codemirror/mode/brainfuck/brainfuck.js");
import("codemirror/mode/clojure/clojure.js");
import("codemirror/mode/clike/clike.js");
import("codemirror/mode/cmake/cmake.js");
import("codemirror/mode/cobol/cobol.js");
import("codemirror/mode/coffeescript/coffeescript.js");
import("codemirror/mode/commonlisp/commonlisp.js");
import("codemirror/mode/crystal/crystal.js");
import("codemirror/mode/css/css.js");
import("codemirror/mode/d/d.js");
import("codemirror/mode/dart/dart.js");
import("codemirror/mode/diff/diff.js");
import("codemirror/mode/django/django.js");
import("codemirror/mode/dockerfile/dockerfile.js");
import("codemirror/mode/dylan/dylan.js");
import("codemirror/mode/ebnf/ebnf.js");
import("codemirror/mode/ecl/ecl.js");
import("codemirror/mode/eiffel/eiffel.js");
import("codemirror/mode/elm/elm.js");
import("codemirror/mode/erlang/erlang.js");
import("codemirror/mode/factor/factor.js");
import("codemirror/mode/forth/forth.js");
import("codemirror/mode/fortran/fortran.js");
import("codemirror/mode/gfm/gfm.js");
import("codemirror/mode/go/go.js");
import("codemirror/mode/groovy/groovy.js");
import("codemirror/mode/haml/haml.js");
import("codemirror/mode/haskell/haskell.js");
import("codemirror/mode/haskell-literate/haskell-literate.js");
import("codemirror/mode/haxe/haxe.js");
import("codemirror/mode/htmlembedded/htmlembedded.js");
import("codemirror/mode/htmlmixed/htmlmixed.js");
import("codemirror/mode/http/http.js");
import("codemirror/mode/idl/idl.js");
import("codemirror/mode/javascript/javascript.js");
import("codemirror/mode/jsx/jsx.js");
import("codemirror/mode/julia/julia.js");
import("codemirror/mode/livescript/livescript.js");
import("codemirror/mode/lua/lua.js");
import("codemirror/mode/mathematica/mathematica.js");
import("codemirror/mode/mirc/mirc.js");
import("codemirror/mode/mllike/mllike.js");
import("codemirror/mode/modelica/modelica.js");
import("codemirror/mode/mumps/mumps.js");
import("codemirror/mode/nginx/nginx.js");
import("codemirror/mode/nsis/nsis.js");
import("codemirror/mode/octave/octave.js");
import("codemirror/mode/oz/oz.js");
import("codemirror/mode/pascal/pascal.js");
import("codemirror/mode/perl/perl.js");
import("codemirror/mode/php/php.js");
import("codemirror/mode/powershell/powershell.js");
import("codemirror/mode/properties/properties.js");
import("codemirror/mode/protobuf/protobuf.js");
import("codemirror/mode/pug/pug.js");
import("codemirror/mode/puppet/puppet.js");
import("codemirror/mode/python/python.js");
import("codemirror/mode/r/r.js");
import("codemirror/mode/rpm/rpm.js");
import("codemirror/mode/rst/rst.js");
import("codemirror/mode/ruby/ruby.js");
import("codemirror/mode/rust/rust.js");
import("codemirror/mode/sas/sas.js");
import("codemirror/mode/sass/sass.js");
import("codemirror/mode/scheme/scheme.js");
import("codemirror/mode/shell/shell.js");
import("codemirror/mode/slim/slim.js");
import("codemirror/mode/smalltalk/smalltalk.js");
import("codemirror/mode/smarty/smarty.js");
import("codemirror/mode/soy/soy.js");
import("codemirror/mode/sparql/sparql.js");
import("codemirror/mode/spreadsheet/spreadsheet.js");
import("codemirror/mode/sql/sql.js");
import("codemirror/mode/stex/stex.js");
import("codemirror/mode/swift/swift.js");
import("codemirror/mode/tcl/tcl.js");
import("codemirror/mode/textile/textile.js");
import("codemirror/mode/toml/toml.js");
import("codemirror/mode/troff/troff.js");
import("codemirror/mode/turtle/turtle.js");
import("codemirror/mode/twig/twig.js");
import("codemirror/mode/vb/vb.js");
import("codemirror/mode/verilog/verilog.js");
import("codemirror/mode/vhdl/vhdl.js");
import("codemirror/mode/webidl/webidl.js");
import("codemirror/mode/xml/xml.js");
import("codemirror/mode/xquery/xquery.js");
import("codemirror/mode/yaml/yaml.js");

function CodeDropEditor({ uploadDrop }) {
  const [editorContent, setEditorContent] = useState("");

  const [language, setLanguage] = useState(null);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState(true);

  const handleLanguageSelect = (ev) => {
    console.log(ev.target.value, CodeMirrorLanguages[ev.target.value]);
    setLanguage(CodeMirrorLanguages[ev.target.value]);
  };

  const handleDropNameChange = (ev) => setTitle(ev.target.value);

  const handleVisibility = (ev) => setVisibility(ev.target.value);

  return (
    <div>
      <Row className="justify-content-end">
        <Button
          onClick={() => uploadDrop(title, language, editorContent, visibility)}
        >
          Publish
        </Button>
        <Button>Discard</Button>
      </Row>

      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Drop Name</Form.Label>
            <Form.Control
              placeholder="Code Drop Name"
              value={title}
              onChange={handleDropNameChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Language</Form.Label>
            <Form.Control
              as="select"
              defaultValue="Choose..."
              onChange={handleLanguageSelect}
            >
              {Object.keys(CodeMirrorLanguages).map((key) => {
                return <option value={key}>{key}</option>;
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Visibility</Form.Label>
            <Form.Control
              as="select"
              defaultValue="Public"
              onChange={handleVisibility}
            >
              <option value={true}>Public</option>
              <option value={false}>Private</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <hr style={{ height: 2 }} />

        <Form.Group>
          <CodeMirror
            value={editorContent}
            onBeforeChange={(editor, data, value) => {
              setEditorContent(value);
            }}
            onChange={(editor, data, value) => {
              console.log(value);
            }}
            options={{
              mode: language,
              electricChars: true,
              lineNumbers: true,
            }}
          />
        </Form.Group>
      </Form>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadDrop: (dropTitle, dropLanguage, dropText, visibility) =>
      dispatch(sendDrop(dropTitle, dropLanguage, dropText, visibility)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropEditor);
