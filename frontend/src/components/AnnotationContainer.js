import React from "react";
import { Button } from "react-bootstrap";
import DropAnnotation from "./CodeDropAnnotation";
import { connect } from "react-redux";

function AnnotationContainer({ annotations, addAnnotation }) {
  return (
    <div>
      {annotations.map((annotation, index) => (
        <DropAnnotation index={index} />
      ))}
      <hr style={{ height: 2 }} />
      <Button onClick={addAnnotation}>New Annotation</Button>
    </div>
  );
}

const mapStateToProps = (state) => {
  console.log("App state", state);
  return {
    annotations: state.annotations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAnnotation: () => dispatch({ type: "NEW_ANNOTATION", payload: null }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnotationContainer);
