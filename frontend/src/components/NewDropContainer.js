import React from "react";
import { Container } from "react-bootstrap";

import DropEditor from "./CodeDropEditor";
import AnnotationContainer from "./AnnotationContainer";
import Navbar from "./Navbar";

function NewDropContainer() {
  return (
    <>
      <Navbar />
      <Container style={{ paddingTop: "5%" }}>
        <DropEditor />
        <AnnotationContainer />
      </Container>
    </>
  );
}

export default NewDropContainer;
