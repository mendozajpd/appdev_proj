import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Sidebar from "./sidebar";


const HomePage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [logoutDisabled, setLogoutDisabled] = useState(false);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // useEffect(() => {
  //   const token = localStorage.getItem("jwt_token");
  //   if (!token) {
  //     navigate('/login');
  //   } else {
  //     fetchUserDetails();
  //   }

  //   if (isVerified) {
  //     handleClose();
  //   } else {
  //     handleShow();
  //   }
  // }, [isVerified]);

  const navigate = useNavigate();

  const buttonStyle = {
    marginTop: "30px",
    fontSize: "150%",
    borderRadius: "20px",
    width: "100%",
    height: "50px",
    marginBottom: "10px",
    backgroundColor: "transparent",
    borderColor: "#8d4b4b",
    color: "#ff3535",
    transition: "background-color 0.3s, color 0.3s, transform 0.3",
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "red";
    e.target.style.color = "white";
    e.target.style.borderColor = "#8d4b4b";
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#ff3535";
    e.target.style.borderColor = "#8d4b4b";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLogoutDisabled(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('jwt_token');
      navigate('/login');
    } catch (error) {
      console.error("Login failed:", error);
      setLogoutDisabled(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get("http://127.0.0.1:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsVerified(response.data.email_verified_at !== null);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const handleSendVerify = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); // disable the button
    setRemainingTime(180); // set remaining time to 3 minutes
    const timerId = setInterval(() => {
      setRemainingTime((time) => time - 1);
    }, 1000);
    setTimeout(() => {
      setIsButtonDisabled(false); // enable the button after 3 minutes
      clearInterval(timerId); // clear the interval
    }, 3 * 60 * 1000);
    try {
      const token = localStorage.getItem("jwt_token");
      const userDetailsResponse = await axios.get("http://127.0.0.1:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userDetailsResponse.data;
      const response = await axios.post(
        "http://127.0.0.1:8000/api/resend-verification-email",
        {
          name: user.name, // use the name from the user's details
          email: user.email, // use the email from the user's details
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (setShow) {
        handleClose();
      }
      console.log(response.data);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={3} md={3}>
            <Sidebar />
          </Col>
          <Col xs={12} md={9} id="dashboard-bg">
            <Row xs={1}>
              <Navbar className="justify-content-end">
                <div className="dashboard-nav">
                  <div className="nav-content">
                    <h1>SUPERADMIN</h1>
                  </div>
                  <div className="nav-button-container">
                    <Button type="submit">Logout</Button>
                  </div>
                </div>
              </Navbar>
            </Row>
            <Row xs={1}>
              <Col>
                <div className="text-center text-white">
                  <h1 style={{ marginTop: "30px" }}>
                    ADMIN
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        transition: "color 0.3s",
                        cursor: "text"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "red";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "white";
                      }}
                    >
                      MEDIAHARBOR
                    </span>
                  </h1>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {/* <Container className="main-container" >
        <Row className="justify-content-md-center">
          <Sidebar/>
          <Col xs={10} md={6}>
            <div className="text-center text-white">
              <h1 style={{ marginTop: "30px" }}>
                ADMIN
                <span
                  style={{
                    marginLeft: "10px",
                    color: "red",
                    transition: "color 0.3s",
                    cursor: "text"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "red";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "white";
                  }}
                >
                  MEDIAHARBOR
                </span>
              </h1>
            </div>
            <Form className="main-content" onSubmit={handleSubmit}>


              <div className="line"></div>

              <hr className="my-4 bg-white" />
            </Form>
          </Col>
        </Row>
      </Container > */}
    </>
  );
};

export default HomePage;
