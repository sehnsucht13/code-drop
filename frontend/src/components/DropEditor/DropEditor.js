import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Controlled as CodeMirror } from "react-codemirror2";
import { set_drop_text } from "../../actions/new_drop_actions";
require("codemirror");
require("codemirror/lib/codemirror.css");

require("codemirror/theme/dracula.css");
require("codemirror/theme/monokai.css");
require("codemirror/theme/gruvbox-dark.css");
require("codemirror/theme/idea.css");
require("codemirror/theme/nord.css");
require("codemirror/theme/solarized.css");
require("codemirror/theme/zenburn.css");
require("codemirror/theme/eclipse.css");
require("codemirror/theme/material.css");
require("codemirror/theme/base16-dark.css");
require("codemirror/theme/base16-light.css");
// TODO: How to split these into new file? Can they be loaded on demand?

import("codemirror/mode/markdown/markdown.js");
import("codemirror/mode/clike/clike.js");
import("codemirror/mode/coffeescript/coffeescript.js");
import("codemirror/mode/css/css.js");
import("codemirror/mode/dart/dart.js");
import("codemirror/mode/diff/diff.js");
import("codemirror/mode/dockerfile/dockerfile.js");
import("codemirror/mode/go/go.js");
import("codemirror/mode/javascript/javascript.js");
import("codemirror/mode/jsx/jsx.js");
import("codemirror/mode/python/python.js");
import("codemirror/mode/rust/rust.js");
import("codemirror/mode/sass/sass.js");
import("codemirror/mode/shell/shell.js");
import("codemirror/mode/sql/sql.js");
import("codemirror/mode/stex/stex.js");
import("codemirror/mode/toml/toml.js");
import("codemirror/mode/yaml/yaml.js");

// Keymaps
import("codemirror/keymap/emacs");
import("codemirror/keymap/vim");
import("codemirror/keymap/sublime");

export const DropEditor = ({
  theme,
  language,
  wrap,
  tabSize,
  fontSize,
  keyMap,
  editorText,
  set_drop_text,
}) => {
  const [editorContent, setEditorContent] = useState(editorText);
  const [editorLanguage, setEditorLanguage] = useState(language);

  useEffect(() => {
    setEditorLanguage(language);
  }, [language]);

  useEffect(() => {
    setEditorContent(editorText);
  }, [editorText]);

  const handleEditorBlur = (editor, event) => {
    set_drop_text({ text: editor.getValue(), lineCount: editor.lineCount() });
  };

  const handleOnChange = (editor, data, value) => {
    setEditorContent(value);
  };

  return (
    <div style={{ fontSize: fontSize }}>
      <CodeMirror
        value={editorContent}
        onBeforeChange={(editor, data, value) => {
          setEditorContent(value);
        }}
        onChange={handleOnChange}
        onBlur={handleEditorBlur}
        options={{
          mode: editorLanguage,
          theme: theme,
          keyMap: keyMap,
          tabSize: tabSize,
          lineWrapping: wrap,
          electricChars: true,
          lineNumbers: true,
        }}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    theme: state.editor.theme,
    language: state.editor.language,
    wrap: state.editor.line_wrap,
    tabSize: state.editor.tab_size,
    fontSize: state.editor.font_size,
    keyMap: state.editor.keymap,
    editorText: state.newDrop.editorText,
  };
};

const mapDispatchToProps = {
  set_drop_text,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropEditor);
