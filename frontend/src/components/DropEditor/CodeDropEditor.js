import React from "react";
import { Row, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { sendDrop } from "../../actions/new_drop_actions";
import EditorSettingsModal from "./EditorSettingsModal";
import DropEditor from "./DropEditor";
import DropInput from "./DropInput";

function CodeDropEditor({ sendDrop }) {
  return (
    <div>
      <Row className="justify-content-end">
        <Button
          onClick={() => {
            console.log("SUBMIT BUTTON CLICKED");
            sendDrop();
          }}
        >
          Publish
        </Button>
        <Button>Discard</Button>
      </Row>
      <hr style={{ height: 2 }} />
      <DropInput />
      <hr style={{ height: 2 }} />
      <DropEditor />
      <hr style={{ height: 2 }} />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {};

const mapDispatchToProps = {
  sendDrop,
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropEditor);
