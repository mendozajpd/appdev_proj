import React, { useState, useEffect, useContext } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { CDBSidebar, CDBSidebarContent, CDBSidebarMenuItem, CDBSidebarMenu, CDBSidebarHeader } from 'cdbreact';
import { Image, Button, CloseButton } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { NavLink } from 'react-router-dom';
import { Form, Row, Col, Stack, Dropdown } from 'react-bootstrap';
import axios from "axios";
import BACKEND_URL from "../config";

// CONTEXT
import StudioContext from "./context/StudioContext";



const StudioSidebar = () => {

    const { sidebarToggled } = useContext(StudioContext);

    const [isVerified, setIsVerified] = useState(false);
    const [logoutDisabled, setLogoutDisabled] = useState(false);

    // User
    const [user, setUser] = useState(null);
    const [isArtist, setIsArtist] = useState(false);

    // Playlist
    const [playlists, setPlaylists] = useState([]);
    const [playlistName, setPlaylistName] = useState('');

    //Refresh

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            fetchUserDetails();
        }

    }, []);


    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data;
            if (userData === null) {
                localStorage.removeItem('jwt_token');
            } else {
                setUser(userData);
                setIsArtist(userData.role === 'artist');
                setIsVerified(userData.email_verified_at !== null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const navigate = useNavigate();


    const handleLogout = async (e) => {
        e.preventDefault();
        setLogoutDisabled(true);
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.post(
                `${BACKEND_URL}/api/auth/logout`,
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

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);



    return (
        <>
            <Modal className="upload-modal" show={show} onHide={handleClose} backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <div className="p-3">
                    <Modal.Header>
                        <Modal.Title>Create New Playlist</Modal.Title>
                        <CloseButton onClick={handleClose} variant="white" />
                    </Modal.Header>
                    <Modal.Body>
                        <>
                            <Row className="d-flex justify-content-center py-3">
                                <Col className="d-flex justify-content-center flex-column">
                                    <Row>
                                        <Form.Group controlId="formPlaylistName">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter playlist name"
                                                value={playlistName} // Set the value to the state variable
                                                onChange={e => setPlaylistName(e.target.value)} // Update the state variable when the input changes
                                            />
                                        </Form.Group>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>

                        {/* <Button variant="danger" onClick={handleCreatePlaylist}> 
                            Create Playlist
                        </Button> */}
                    </Modal.Footer>
                </div>
            </Modal>

            <CDBSidebar toggled={sidebarToggled} textColor="#fff" backgroundColor="#101011" className="user-sidebar sidebar">
                <Image
                    src="/register/logo-white.png"
                    roundedCircle
                    className="Register-apple"
                    onClick={() => navigate('/')}
                    style={{
                        width: "50px",
                        height: "50px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "10px",
                        cursor: 'pointer'
                    }}
                />
                <Col className="flex-grow-1 d-flex flex-column vh-100" fluid>
                    <Row className="align-items-start">
                        <CDBSidebarContent>
                            {!sidebarToggled ? (
                                <CDBSidebarMenu className="mb-5">
                                    <CDBSidebarMenuItem className="sub-header my-5">
                                        <div className="d-inline align-content-center fade-in">
                                            <div className="sub-header d-flex studio-pfp-container flex-column flex-wrap">
                                                <div className="d-flex justify-content-center">
                                                    <Image src="https://via.placeholder.com/125" roundedCircle className="studio-pfp clickable" onClick={() => navigate(`/user/${user.id}`)} />
                                                </div>
                                                <div className="mt-2 d-flex justify-content-center">
                                                    Artist
                                                </div>
                                                <div className="studio-artist-name mt-2 d-flex justify-content-center">
                                                    {user && user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </CDBSidebarMenuItem>
                                </CDBSidebarMenu>
                            ) : (
                                <CDBSidebarMenu>
                                    <CDBSidebarMenuItem icon="user" className="sub-header "></CDBSidebarMenuItem>
                                </CDBSidebarMenu>
                            )}
                            <CDBSidebarMenu>
                                <nav id="sidebar">
                                    <NavLink to="" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="th-large">Dashboard</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="content" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="headphones">Content</CDBSidebarMenuItem>
                                    </NavLink>
                                    <CDBSidebarHeader className="sub-header"></CDBSidebarHeader>
                                </nav>
                            </CDBSidebarMenu>
                        </CDBSidebarContent>
                    </Row>
                </Col>
            </CDBSidebar>
        </>
    );
};
export default StudioSidebar;