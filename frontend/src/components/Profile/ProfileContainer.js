import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import NavBar from "../NavBar/Navbar";
import FilterList from "./FilterList";

const randomColor = require("randomcolor");

const dummyProfileData = {
  user: "Yavor",
  description: "Here is my description of a user",
  stars: 44,
  forks: 32,
  languages: {
    php: 3,
    python: 2,
    lisp: 10,
  },
  drops: [
    {
      id: 1,
      title: "Hello world",
      language: "python",
    },
    {
      id: 2,
      title:
        " Why was the soccer game so hot? Why was the soccer game so hot? Why was the soccer game so hot?",
      language: "c++",
    },
    {
      id: 3,
      title: "Hello world 3",
      language: "python",
    },
    {
      id: 3,
      title: "Hello world 3",
      language: "python",
    },
    {
      id: 3,
      title: "Hello world 3",
      language: "python",
    },
    {
      id: 3,
      title: "Hello world 3",
      language: "python",
    },
  ],
};

function createPiechartData(languages) {
  let languageLabels = [];
  let languageCounts = [];
  const chartLabel = "Languages";
  const randomColorSeed = Date.now();

  for (const language in languages) {
    languageLabels.push(language);
    languageCounts.push(languages[language]);
  }

  if (languageLabels.length === 0) {
    return {
      labels: ["None"],
      datasets: [
        {
          label: chartLabel,
          data: [0],
          backgroundColor: "rgb(128,128,128, 0.3)",
          borderColor: "rgb(128,128,128, 1)",
          borderWidth: 1.5,
        },
      ],
    };
    // There is no data
  } else {
    const backgroundColor = randomColor({
      seed: randomColorSeed,
      format: "rgba",
      count: languageLabels.length,
      alpha: 0.3,
    });
    const borderColor = randomColor({
      seed: randomColorSeed,
      format: "rgba",
      count: languageLabels.length,
      alpha: 1,
    });
    return {
      labels: languageLabels,
      datasets: [
        {
          label: chartLabel,
          data: languageCounts,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };
  }
}

export const ProfileContainer = (props) => {
  return (
    <div>
      <NavBar />
      <Container className="d-flex" style={{ height: "100%" }} fluid>
        <Col md={3} style={{ paddingTop: "2%" }}>
          <Image src={require("./test_img.png")} rounded />
          <p className="h4">{dummyProfileData.user}</p>
          <p className="">{dummyProfileData.description}</p>
        </Col>
        {/* <div style={{ borderLeft: "0.2rem solid #000000" }}></div> */}
        <Col xs={12} md={9} style={{ paddingTop: "2%" }}>
          <Row className="justify-content-around">
            <p className="h4">Stars {dummyProfileData.stars}</p>
            <p className="h4">Forks {dummyProfileData.forks}</p>
          </Row>
          <Col>
            <p className="h5 text-center">Languages</p>
            <Pie data={createPiechartData(dummyProfileData.languages)} />
          </Col>
          <hr />
          <FilterList drops={dummyProfileData.drops} />
        </Col>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
