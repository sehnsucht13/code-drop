import React from "react";
import { Container } from "react-bootstrap";

import DropEditor from "./CodeDropEditor";
import AnnotationContainer from "../CodeAnnotations/AnnotationContainer";
import Navbar from "../NavBar/Navbar";

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
