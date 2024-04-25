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
import UserSidebarContext from "./context/UserSidebarContext";



const UserSidebar = () => {


    const [isVerified, setIsVerified] = useState(false);
    const [logoutDisabled, setLogoutDisabled] = useState(false);

    // User
    const [user, setUser] = useState(null);
    const [isArtist, setIsArtist] = useState(false);

    // Playlist
    const [playlists, setPlaylists] = useState([]);
    const [playlistName, setPlaylistName] = useState('');

    //Refresh
    const { refreshSidebar } = useContext(UserSidebarContext);

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            fetchUserDetails();
        }

        fetchPlaylists();
    }, [refreshSidebar]);

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
                    console.log('Playlists:', response.data)
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
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large "></i>}>
                    <div className="d-flex align-items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        {user ? (
                            <Dropdown show={dropdownOpen} className="profile-dropdown">
                                <Dropdown.Toggle id="dropdown-basic">
                                    <Image src="https://via.placeholder.com/50" roundedCircle className="pfp" />
                                    {user.name}
                                </Dropdown.Toggle>
                                <Dropdown.Menu variant="dark">
                                    <Dropdown.Item href={`/user/${user.id}`}>
                                        <i className="fa fa-user mx-2 text-white"></i>
                                        Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item href="/settings">
                                        <i className="fa fa-cog mx-2 text-white"></i>
                                        Settings
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>
                                        <i className="fa fa-sign-out mx-2 text-white"></i>
                                        Log out
                                    </Dropdown.Item>
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
                                        <CDBSidebarMenuItem icon="" active={false}>Podcast</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="">Videocasts</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="">Subscription</CDBSidebarMenuItem>
                                    </NavLink>
                                    {isArtist && (
                                        <>
                                            {/* <CDBSidebarHeader className="sub-header"></CDBSidebarHeader> */}
                                            {/* <CDBSidebarMenuItem icon="" className="sub-header d-flex justify-content-between">
                                                <div className="sub-header">
                                                    Artist
                                                </div>
                                            </CDBSidebarMenuItem> */}
                                            {/* <NavLink to="/upload" activeclassname="activeClicked">
                                                <CDBSidebarMenuItem icon="">Metrics</CDBSidebarMenuItem>
                                            </NavLink> */}
                                            <NavLink to="/studio" activeclassname="activeClicked">
                                                <CDBSidebarMenuItem icon="">MediaHarbor Studio</CDBSidebarMenuItem>
                                            </NavLink>
                                        </>
                                    )}
                                    <CDBSidebarHeader className="sub-header"></CDBSidebarHeader>
                                    <CDBSidebarMenuItem icon="" className="sub-header d-flex justify-content-between">
                                        <div className="sub-header">
                                            Library
                                            <i onClick={handleShow} className="fa fa-plus-square mx-3 icon-click text-red"></i>
                                        </div>
                                    </CDBSidebarMenuItem>
                                    {playlists.map((playlist, index) => (
                                        <NavLink to={`/playlist/${playlist.id}`} key={index} activeclassname="activeClicked">
                                            <CDBSidebarMenuItem icon="">
                                                <div className="d-flex align-items-center">
                                                    {playlist.name}
                                                </div>
                                                <div className="sidebar-library-details">
                                                    Playlist
                                                    <i className="fa fa-circle mx-2 text-white sidebar-dot-separator"></i>
                                                    {playlist.creator.name}
                                                </div>
                                            </CDBSidebarMenuItem>
                                        </NavLink>
                                    ), [playlists])}
                                    {/* <CDBSidebarHeader className="sub-header"></CDBSidebarHeader> */}
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