import React from "react";
import { Row, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { sendDrop } from "../../actions/annotation_actions";
import EditorSettingsModal from "./EditorSettingsModal";
import DropEditor from "./DropEditor";
import DropInput from "./DropInput";

function CodeDropEditor({ uploadDrop }) {
  return (
    <div>
      <Row className="justify-content-end">
        <Button>Publish</Button>
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

const mapDispatchToProps = (dispatch) => {
  return {
    uploadDrop: (dropTitle, dropLanguage, dropText, visibility) =>
      dispatch(sendDrop(dropTitle, dropLanguage, dropText, visibility)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropEditor);
