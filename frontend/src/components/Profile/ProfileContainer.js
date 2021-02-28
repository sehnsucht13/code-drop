import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import NavBar from "../NavBar/Navbar";
import FilterList from "./FilterList";
import Footer from "../Footer/Footer";
import LoadingPage from "../Loading/LoadingPage";
import PieChart from "./PieChart";
import StatSummary from "./StatSummary";
import SideBar from "./SideBar";
import ErrorPage from "../Error/ErrorContainer";

export const ProfileContainer = () => {
  const [queryParams] = useState(queryString.parse(useLocation().search));
  const [hasLoadedProfileData, setHasLoadedProfileData] = useState(false);
  const [profileData, setProfileData] = useState(undefined);
  const [hasError, setHasError] = useState({
    status: false,
    errCode: undefined,
  });

  // Passed to child component and used to refresh the list of drops if one is deleted
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    console.log(
      "called render in profile container with refresh status",
      shouldRefresh
    );
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
        <Container className="d-flex flex-column" fluid>
          <SideBar
            username={profileData.profile.username}
            description={profileData.profile.description}
          />
          <hr />
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
        </Container>
        <Footer />
      </div>
    );
  }
};

export default connect()(ProfileContainer);
