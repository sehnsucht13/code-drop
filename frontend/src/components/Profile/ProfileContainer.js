import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Col, Alert } from "react-bootstrap";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import NavBar from "../NavBar/Navbar";
import FilterList from "./FilterList";
import Footer from "../Footer/Footer";
import LoadingPage from "../Loading/LoadingPage";
import PieChart from "./PieChart";
import StatSummary from "./StatSummary";
import SideBar from "./SideBar";
import axios from "axios";

export const ProfileContainer = ({ isAuth, user }) => {
  const [queryParams, setQueryParams] = useState(
    queryString.parse(useLocation().search)
  );
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileData, setProfileData] = useState(undefined);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    axios
      .get(`/user/${queryParams.id}/profile`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setProfileData(response.data);
          setHasLoaded(true);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setHasError(true);
      });
  }, [queryParams]);

  return (
    <div style={{ height: "100%" }}>
      <NavBar />
      {!hasLoaded ? (
        hasError ? (
          <div style={{ height: "100%" }}>
            <Alert variant="danger">
              Issue with loading the profiile. Please refresh the page!
            </Alert>
          </div>
        ) : (
          <LoadingPage />
        )
      ) : (
        <Container
          className="d-flex"
          style={{ height: "150%", paddingBottom: "1rem" }}
          fluid
        >
          <Col md={3} style={{ paddingTop: "1.5rem" }}>
            <SideBar
              username={profileData.profile.username}
              description={profileData.profile.description}
            />
          </Col>
          {/* <div style={{ borderLeft: "0.2rem solid #000000" }}></div> */}
          <Col xs={12} md={9} style={{ paddingTop: "1.5rem" }}>
            <StatSummary
              numStars={profileData.profile.numStars}
              numForks={profileData.profile.numForks}
            />
            <PieChart counts={profileData.counts} />
            <hr />
            <FilterList drops={profileData.drops} />
          </Col>
        </Container>
      )}
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileContainer);
