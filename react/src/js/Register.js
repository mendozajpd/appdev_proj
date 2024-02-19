import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import { Spinner } from "react-bootstrap";


function Register() {

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      navigate('/home');
    }
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [registerButtonClicked, setRegisterButtonClicked] = useState(false);

  const [myInteger, setMyInteger] = useState(0);

  const [clickedFields, setClickedFields] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const empty_field_notif = () =>
    toast.error("Please fill in all the required fields.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      theme: "dark",
      transition: Bounce,
    });

  const register_fail = () =>
    toast.error("User registration failed.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: Spinner,
      theme: "dark",
      transition: Flip,
    });

  const register_success = () => {
    toast.success("User registered successfully.", {
      position: "top-center",
      autoClose: 200,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      onClose: () => navigate("/home"),
    });
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowPasswordRequirements(false); // Hide password requirements pop-up on input change
  };

  const handleFieldClick = (field) => {
    setClickedFields({ ...clickedFields, [field]: true });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the required fields are empty
    const requiredFields = ["name", "email", "password", "confirmPassword"];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      // Set error messages for the empty fields
      const emptyFieldsErrors = {};
      emptyFields.forEach((field) => {
        emptyFieldsErrors[field] = "This field is required";
      });
      setClickedFields({ ...clickedFields, ...emptyFieldsErrors });
      empty_field_notif();
      return;
    }

    // Set register button clicked state
    setRegisterButtonClicked(true);

    try {
      // Validate the password before submitting
      if (!isValidPassword(formData.password)) {
        setShowPasswordRequirements(true); // Show password requirements pop-up
        return;
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register", // add to config
        formData
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setMyInteger(myInteger + 1);
      register_success();
      // navigate("/login");
    } catch (error) {
      register_fail();
      console.error("Registration failed:", error);
      // alert(error.response.data.message);
    }
  };

  const handleSocialButtonMouseEnter = (e) => {
    e.target.style.backgroundColor = "red";
    e.target.style.color = "white";
    e.target.style.borderColor = "rgba(185, 128, 128, 0.3)";
    e.target.style.transform = "scale(1.05)";
    e.stopPropagation();
  };

  const handleSocialButtonMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "white";
    e.target.style.borderColor = "rgba(185, 128, 128, 0.3)";
    e.target.style.transform = "scale(1)";
    e.stopPropagation();
  };

  const isValidUsername = (username) => {
    // Username must be more than 4 characters
    return username.length > 4;
  };

  const isValidEmail = (email) => {
    // Simple email validation (you may want to use a more robust validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    // Password must be at least 8 characters long,
    // contain at least one uppercase letter, one lowercase letter, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const getInputStyle = (field, data, clickedFields, num, formData) => {
    if (num > 0 && field === "username") {
      return {
        color: "whitesmoke",
        width: "100%",
        marginTop: "10px",
        padding: "12px",
        borderRadius: "20px",
        border: `1px solid ${isValidUsername(data) && clickedFields[field] ? "red" : "#8d4b4b"
          }`,
        backgroundColor: "transparent",
      };
    }

    if (num > 0 && field === "email") {
      return {
        color: "whitesmoke",
        width: "100%",
        marginTop: "10px",
        padding: "12px",
        borderRadius: "20px",
        border: `1px solid ${!isValidEmail(data) && clickedFields[field] ? "red" : "#8d4b4b"
          }`,
        backgroundColor: "transparent",
      };
    }

    if (num > 0 && field === "password") {
      return {
        color: "whitesmoke",
        width: "100%",
        marginTop: "10px",
        padding: "12px",
        borderRadius: "20px",
        border: `1px solid ${!isValidPassword(data) && clickedFields[field] && myInteger < 1 ? "red" : "#8d4b4b"
          }`,
        backgroundColor: "transparent",
      };
    }

    if (num > 0 && field === "confirmPassword") {
      return {
        color: "whitesmoke",
        width: "100%",
        marginTop: "10px",
        padding: "12px",
        borderRadius: "20px",
        border: `1px solid ${data !== formData.password && clickedFields[field] ? "red" : "#8d4b4b"
          } `,
        backgroundColor: "transparent",
      };
    } else {
      return {
        color: "whitesmoke",
        width: "100%",
        marginTop: "10px",
        padding: "12px",
        borderRadius: "20px",
        border: `1px solid #8d4b4b`,
        backgroundColor: "transparent",
      };
    }
  };

  const submitButtonStyle = {
    marginTop: "10px",
    fontSize: "150%",
    borderRadius: "20px",
    width: "100%",
    height: "50px",
    marginBottom: "10px",
    borderColor: "rgba(185, 128, 128, 0.3)",
    color: "#ff3535",
    transition: "background-color 0.3s, color 0.3s, transform 0.3s",
  };

  const submitButtonTextStyle = {
    fontSize: "20px",
    color: "white",
    margin: 0,
    padding: 0,
    transition: "color 0.3s",
  };

  // MODAL
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // CHECKBOX
  const [termsChecked, setTermsChecked] = useState(false);

  const handleAccept = () => {
    setTermsChecked(true);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
            commodi aspernatur enim, consectetur. Cumque deleniti temporibus
            ipsam atque a dolores quisquam quisquam adipisci possimus
            laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
            accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
            reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
            deleniti rem!
          </p></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleAccept}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="Register-container">
        <div className="Register-social-container">
          <div>
            <h1 style={{ marginTop: "30px" }}>
              Sign up to start
              <span
                style={{
                  marginLeft: "10px",
                  color: "red",
                  transition: "color 0.3s",
                  cursor: "text",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "red";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "white";
                }}
              >
                LISTENING
              </span>
            </h1>
          </div>

          {/* google */}

          <Button
            className="Register-social-button rounded-pill"
            variant="light"
            style={{
              width: "100%",
              height: "50px",
              marginTop: "30px",
              marginBottom: "10px",
              backgroundColor: "transparent",
              borderColor: "rgba(185, 128, 128, 0.3)",
              color: "white",
              transition: "background-color 0.3s, color 0.3s, transform 0.3s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={handleSocialButtonMouseEnter}
            onMouseLeave={handleSocialButtonMouseLeave}
          >
            <div
              className="buttonContent"
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}
            >
              <Image
                src="/register/google.png"
                roundedCircle
                className="Register-google"
                style={{
                  marginRight: "20px",
                  width: "30px",
                  margin: "flex",
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                }}
              />
              <p
                style={{ fontSize: "20px", fontWeight: "500" }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                }}
              >
                Login with Google
              </p>
            </div>
          </Button>

          {/* facebook */}
          <Button
            className="Register-social-button rounded-pill"
            variant="light"
            style={{
              width: "100%",
              height: "50px",
              marginTop: "10px",
              marginBottom: "10px",
              backgroundColor: "transparent",
              borderColor: "rgba(185, 128, 128, 0.3)",
              color: "#333333",
              transition: "background-color 0.3s, color 0.3s, transform 0.3s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={handleSocialButtonMouseEnter}
            onMouseLeave={handleSocialButtonMouseLeave}
          >
            <div
              className="buttonContent"
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}
            >
              <Image
                src="/register/facebook.png"
                roundedCircle
                className="Register-facebook"
                style={{
                  marginRight: "20px",
                  width: "30px",
                  margin: "flex",
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                }}
              />
              <p
                style={{ fontSize: "20px", fontWeight: "500" }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                }}
              >
                Login with Facebook
              </p>
            </div>
          </Button>

          {/* apple */}

          <Button
            className="Register-social-button rounded-pill"
            variant="light"
            style={{
              width: "100%",
              height: "50px",
              marginTop: "10px",
              marginBottom: "10px",
              backgroundColor: "transparent",
              borderColor: "rgba(185, 128, 128, 0.3)",
              color: "white",
              transition: "background-color 0.3s, color 0.3s, transform 0.3s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={handleSocialButtonMouseEnter}
            onMouseLeave={handleSocialButtonMouseLeave}
          >
            <div
              className="buttonContent"
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}
            >
              <Image
                src="/register/apple.png"
                roundedCircle
                className="Register-apple"
                style={{
                  marginRight: "20px",
                  width: "30px",
                  margin: "flex",
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                }}
              />
              <p
                style={{ fontSize: "20px", fontWeight: "500" }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                }}
              >
                Continue with Apple
              </p>
            </div>
          </Button>
        </div>

        <div className="Register-signup-form">
          <div className="Register-textbox">
            <Form onSubmit={handleSubmit}>
              <p>Sign up</p>
              <div className="line"></div>

              <Form.Group
                className="Register-textbox"
                controlId="formGroupUsername"
              >
                <Form.Label className="label">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onClick={() => handleFieldClick("name")}
                  value={formData.name}
                  style={getInputStyle(
                    "name",
                    formData.name,
                    clickedFields,
                    myInteger,
                    formData
                  )}
                />
                {clickedFields.name && !formData.name && myInteger < 1 && (
                  <div className="error-message">Enter your username</div>
                )}
              </Form.Group>

              <Form.Group className="Register-textbox" controlId="formGroupEmail">
                <Form.Label className="label">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onClick={() => handleFieldClick("email")}
                  value={formData.email}
                  style={getInputStyle(
                    "email",
                    formData.email,
                    clickedFields,
                    myInteger,
                    formData
                  )}
                />
                {clickedFields.email &&
                  !isValidEmail(formData.email) && myInteger < 1 &&
                  (
                    <div className="error-message">Enter a valid email</div>
                  )}
              </Form.Group>

              <Form.Group className="Register-textbox" controlId="formGroupPass">
                <Form.Label className="label">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onClick={() => handleFieldClick("password")}
                  onFocus={() => handleFieldClick("password")}
                  value={formData.password}
                  style={getInputStyle(
                    "password",
                    formData.password,
                    clickedFields,
                    myInteger,
                    formData
                  )}
                />
                {clickedFields.password &&
                  !isValidPassword(formData.password) && myInteger < 1 &&
                  (
                    <div className="error-message">
                      Password must be atleast 8 characters long, contain uppercase,
                      lowercase, and numbers
                    </div>
                  )}
                {/* {displayPasswordRequirements()} */}
              </Form.Group>

              <Form.Group
                className="Register-textbox"
                controlId="formGroupConPass"
              >
                <Form.Label className="label">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  onClick={() => handleFieldClick("confirmPassword")}
                  value={formData.confirmPassword}
                  style={getInputStyle(
                    "confirmPassword",
                    formData.confirmPassword,
                    clickedFields,
                    myInteger,
                    formData
                  )}
                />
                {clickedFields.confirmPassword &&
                  formData.password !== formData.confirmPassword && myInteger < 1 && (
                    <div className="error-message">Passwords do not match</div>
                  )}
              </Form.Group>

              <div className="remember-me">
                <Form.Check
                  type="checkbox"
                  label={
                    <span>
                      I agree to{" "}
                      <span
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={handleShow}
                      >
                        Terms and Conditions
                      </span>
                    </span>
                  }
                  checked={termsChecked}
                  onChange={() => setTermsChecked(!termsChecked)}
                />
              </div>

              <Button
                className="Register-button"
                variant="outline-danger"
                type="submit"
                style={submitButtonStyle}
                disabled={!termsChecked && myInteger < 1}
              >
                <span style={submitButtonTextStyle}>Register</span>
              </Button>
            </Form>
          </div>
          <div className="line"></div>
          <div className="loginNavigate">
            <p>Have an account? </p>
            <Link to={"/login"} style={{ textDecoration: "none" }}></Link>
            <Link to={"/login"}> Log in here</Link>
          </div>
        </div>
        <ToastContainer />
      </div >
    </>

  );
}

export default Register;
