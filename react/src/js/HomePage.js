import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const HomePage = () => {
  const [formData] = useState({

  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.post(
        "http://127.0.0.1:8080/api/auth/logout",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      localStorage.removeItem('jwt_token');
      navigate('/login');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container className="main-container">
      <Row className="justify-content-md-center">
        <Col xs={10} md={6}>
          <div className="text-center text-white">
            <h1 style={{ marginTop: "30px" }}>
              Welcome to
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
            <Button
              variant="primary"
              className="login-button btn-block"
              style={{
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
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ff3535";
                e.target.style.borderColor = "#8d4b4b";
              }}
              type="submit"
            >
              Log out
            </Button>

            <div className="line"></div>

            <hr className="my-4 bg-white" />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
