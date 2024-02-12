import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const HomePage = () => {
  const [formData] = useState({

  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/logout",
      );
      console.log(response.data);
      window.location = "/login";
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
                width: "100%", // Set width to match input fields
                height: "50px", // Set height to match input fields
                marginBottom: "10px",
                backgroundColor: "transparent", // Set default background color
                borderColor: "#8d4b4b", // Set default border color
                color: "#ff3535", // Set default text color
                transition: "background-color 0.3s, color 0.3s, transform 0.3", // Add transition for smooth effect
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

            <div class="line"></div>

            <hr className="my-4 bg-white" />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
