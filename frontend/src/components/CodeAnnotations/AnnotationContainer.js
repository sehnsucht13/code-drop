import React from "react";
import { Button, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { add_annotation } from "../../actions/annotation_actions";
import DropAnnotation from "./CodeDropAnnotation";

function AnnotationContainer({ annotations, addAnnotation }) {
  return (
    <div>
      {annotations.map((annotation, index) => (
        <DropAnnotation index={index} />
      ))}
      <hr style={{ height: 2 }} />
      <Row className="justify-content-center">
        <Button onClick={addAnnotation}>Add Annotation</Button>
      </Row>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    annotations: state.annotationReducer.annotations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAnnotation: () => dispatch(add_annotation()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnotationContainer);
