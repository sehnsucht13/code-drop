import React from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { add_annotation } from "../../actions/annotation_actions";
import DropAnnotation from "./CodeDropAnnotation";

function AnnotationContainer({ annotations, addAnnotation }) {
  return (
    <div style={{ minHeight: "25%" }}>
      {annotations.map((annotation, index) => (
        <DropAnnotation index={index} />
      ))}
      {annotations.length !== 0 && <hr style={{ height: 2 }} />}
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
