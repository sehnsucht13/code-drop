import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import NavBar from "../NavBar/Navbar";
import FilterList from "./FilterList";
import Footer from "../Footer/Footer";
import LoadingPage from "../Loading/LoadingPage";
import PieChart from "./PieChart";
import StatSummary from "./StatSummary";
import SideBar from "./SideBar";
import ErrorPage from "../Error/ErrorContainer";

export const ProfileContainer = ({ isAuth, user }) => {
  const [queryParams] = useState(queryString.parse(useLocation().search));
  const [hasLoadedProfileData, setHasLoadedProfileData] = useState(false);
  const [profileData, setProfileData] = useState(undefined);
  const [hasError, setHasError] = useState({
    status: false,
    errCode: undefined,
  });

  // Passed to child component and used to refresh the list of drops if one is deleted
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // console.log(
  //   "Profile cotaier auth",
  //   isAuth,
  //   user.uid,
  //   isAuth && user.uid === queryParams.id,
  //   queryParams.id,
  //   parseInt(queryParams.id, 10) === user.uid
  // );
  useEffect(() => {
    if (shouldRefresh === true) {
      setShouldRefresh(false);
    }
    axios
      .get(`/user/${queryParams.id}/profile`)
      .then((response) => {
        if (response.status === 200) {
          setProfileData(response.data);
          setHasLoadedProfileData(true);
        }
      })
      .catch((error) => {
        setHasError({ status: true, errCode: error.response.status });
        setHasLoadedProfileData(true);
      });
  }, [queryParams, shouldRefresh]);

  if (!hasLoadedProfileData && hasError.status === false) {
    return (
      <>
        <NavBar />
        <LoadingPage />
        <Footer />
      </>
    );
  } else if (
    hasError.status === true &&
    (hasError.errCode === 404 || hasError.errCode === 400)
  ) {
    return (
      <>
        <NavBar />
        <ErrorPage type="profile" />
        <Footer />
      </>
    );
  } else if (hasError.status === true) {
    return (
      <>
        <NavBar />
        <Container fluid>
          <Alert variant="danger">
            There was an unknown issue with loading the profiile. Please refresh
            the page!
          </Alert>
        </Container>
        <Footer />
      </>
    );
  } else {
    return (
      <div style={{ height: "100%" }}>
        <NavBar />
        <Container
          className="d-flex flex-column"
          fluid
          style={{ marginTop: "0.5rem" }}
        >
          <Row>
            <Col md={3}>
              <SideBar
                username={profileData.profile.username}
                description={profileData.profile.description}
                avatar={profileData.profile.avatar}
                allowEdit={
                  isAuth && user && user.uid === parseInt(queryParams.id, 10)
                }
                userId={user ? user.uid : undefined}
              />
            </Col>
            <hr />
            <Col md={9}>
              <StatSummary
                numStars={profileData.profile.numStars}
                numForks={profileData.profile.numForks}
              />
              <PieChart counts={profileData.counts} />
              <hr />
              <FilterList
                drops={profileData.drops}
                refreshCallback={setShouldRefresh}
              />
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileContainer);
