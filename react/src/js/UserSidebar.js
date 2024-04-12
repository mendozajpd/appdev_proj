import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { CDBSidebar, CDBSidebarContent, CDBSidebarMenuItem, CDBSidebarMenu, CDBSidebarHeader } from 'cdbreact';
import { Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { NavLink } from 'react-router-dom';
import { Form, Row, Col, Stack, Dropdown } from 'react-bootstrap';
import axios from "axios";
import BACKEND_URL from "../config";



const UserSidebar = () => {


    const [isVerified, setIsVerified] = useState(false);
    const [logoutDisabled, setLogoutDisabled] = useState(false);

    // User
    const [user, setUser] = useState(null);
    const [isArtist, setIsArtist] = useState(false);

    // Playlist
    const [playlists, setPlaylists] = useState([]);
    const [playlistName, setPlaylistName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            fetchUserDetails();
        }
        fetchPlaylists();
    }, []);

    const navigate = useNavigate();

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

    const fetchPlaylists = async () => {
        const token = localStorage.getItem("jwt_token");
        try {
            axios.get(`${BACKEND_URL}/api/playlists`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    setPlaylists(response.data);
                })
                .catch(error => {
                    console.error('Failed to fetch playlists:', error);
                });
        } catch (error) {
            console.error("Failed to fetch playlists:", error);
        }
    }

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

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwt_token");
            axios.post(`${BACKEND_URL}/api/create-playlist`, {
                name: playlistName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(response => {
                    console.log('Playlist created:', response.data);
                    handleClose();
                    navigate(`/playlist/${response.data.id}`);
                    setPlaylistName('');
                    fetchPlaylists();
                })
                .catch(error => {
                    console.error('Failed to create playlist:', error);
                });
        } catch (e) {
            console.error('Failed to create playlist:', e);
        }
    }

    return (
        <>
            <Modal className="upload-modal" show={show} onHide={handleClose} backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <div className="p-3">
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Playlist</Modal.Title>
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

                        <Button variant="danger" onClick={handleCreatePlaylist}> {/* Call handleCreatePlaylist when the button is clicked */}
                            Create Playlist
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            <CDBSidebar textColor="#fff" backgroundColor="#101011" className="user-sidebar sidebar">
                <Image
                    src="/register/logo-white.png"
                    roundedCircle
                    className="Register-apple"
                    style={{
                        width: "50px",
                        height: "50px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "10px",
                    }}
                />
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large "></i>}>
                    <div className="d-flex align-items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        {user ? (
                            <Dropdown show={dropdownOpen} className="profile-dropdown">
                                <Dropdown.Toggle id="dropdown-basic">
                                    <Image src="https://via.placeholder.com/50" roundedCircle className="pfp" />
                                    {user.name}
                                </Dropdown.Toggle>
                                <Dropdown.Menu variant="dark">
                                    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : 'Loading...'}
                    </div>
                </CDBSidebarHeader>
                <Col className="flex-grow-1 d-flex flex-column vh-100" fluid>
                    <Row className="align-items-start">
                        <CDBSidebarContent>
                            <CDBSidebarMenu>
                                <nav id="sidebar">
                                    <NavLink to="/" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="">Home</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="">Podcast</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="">Videocasts</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="">Subscription Settings</CDBSidebarMenuItem>
                                    </NavLink>
                                    {isArtist && (
                                        <>
                                            <CDBSidebarHeader className="sub-header"></CDBSidebarHeader>
                                            {/* <CDBSidebarMenuItem icon="" className="sub-header">ARTIST</CDBSidebarMenuItem> */}
                                            {/* <CDBSidebarMenuItem icon="" className="sub-header">ARTIST</CDBSidebarMenuItem> */}
                                            <div className="mx-4 my-3">
                                            </div>
                                            <NavLink to="/upload" activeclassname="activeClicked">
                                                <CDBSidebarMenuItem icon="">Artist Studio</CDBSidebarMenuItem>
                                            </NavLink>
                                        </>
                                    )}
                                    <CDBSidebarHeader className="sub-header"></CDBSidebarHeader>
                                    <CDBSidebarMenuItem onClick={handleShow} icon="" className="sub-header d-flex justify-content-between">
                                        PLAYLISTS
                                        <i className="fa fa-plus-square mx-3 text-red"></i>
                                    </CDBSidebarMenuItem>
                                    {playlists.map((playlist, index) => (
                                        <NavLink to={`/playlist/${playlist.id}`} key={index} activeclassname="activeClicked">
                                            <CDBSidebarMenuItem icon="">{playlist.name}</CDBSidebarMenuItem>
                                        </NavLink>
                                    ))}
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
export default UserSidebar;