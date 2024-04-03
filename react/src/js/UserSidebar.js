import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import '../css/index.css'
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarMenuItem,
    CDBSidebarMenu,
    CDBSidebarHeader
} from 'cdbreact';
import { Image, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { NavLink } from 'react-router-dom';
import { Form, Container, Row, Col, Table, Stack } from 'react-bootstrap';
import axios from "axios";
import BACKEND_URL from "../config";



const UserSidebar = props => {
    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            navigate('/login');
        } else {
            fetchUserDetails();
        }
    }, []);

    const [isVerified, setIsVerified] = useState(false);
    const [logoutDisabled, setLogoutDisabled] = useState(false);

    const [user, setUser] = useState(null);
    const [isArtist, setIsArtist] = useState(false);

    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data; // Assuming user details are directly in response.data
            //console.log(userData);
            setUser(userData);
            setIsArtist(userData.role === 'artist');
            setIsVerified(userData.email_verified_at !== null);
            // Check if the user has admin or superadmin role
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const handleSubmit = async (e) => {
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

    return (
        <>
            <Modal className="upload-modal" show={show} size='lg' onHide={handleClose} backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <div className="p-3">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <>
                            <Row className='py-3 d-flex px-3' style={{ borderBottom: '1px solid #B93B3B' }}>
                                <Col className="d-flex align-items-center justify-content-center py-2">
                                    <Row className="album-cover-preview d-flex justify-content-center">
                                        {/* <AlbumCoverDropzone onDrop={handleAlbumCoverDrop} iconClass='fa fa-picture-o' iconSize={60} uploadText='Drag and drop album cover image here or click to select file' uploadTextClass='custom-dropzone-text' /> */}
                                    </Row>
                                </Col>
                                <Col xs={12} sm={12} xl={7}>
                                    <Form>
                                        <Stack direction="vertical" className="px-3" gap={1}>
                                            <Form.Group controlId="album_name">
                                                {/* <Form.Label>Album Title</Form.Label> */}
                                                {/* <Form.Control className="input-style" type="text" placeholder="Album title" value={albumTitle} onChange={e => setAlbumTitle(e.target.value)} /> */}
                                            </Form.Group>
                                            <Form.Group controlId="album_description">
                                                {/* <Form.Label>Album Description</Form.Label> */}
                                                {/* <Form.Control className="textarea-style input-style" as="textarea" rows={3} placeholder="Description" value={albumDescription} onChange={e => setAlbumDescription(e.target.value)} /> */}
                                            </Form.Group>
                                            <Form.Group controlId="collaborator_names">
                                                <Form.Label>Collaborators</Form.Label>
                                                {/* <Form.Control className="input-style" type="text" placeholder="Artist names" value={artistNames} onChange={e => setArtistNames(e.target.value)} /> */}
                                            </Form.Group>
                                        </Stack>
                                    </Form>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center py-3">
                                {/* <Col>
                      nice
                    </Col> */}
                                <Col className="d-flex justify-content-center flex-column">
                                    {/* <Row>
                        ADD SONGS
                      </Row> */}
                                    <Row>
                                        {/* <MediaDropzone onDrop={handleMediaDrop} onGenreChange={handleGenreChange} iconClass='fa fa-upload' iconSize={70} uploadText='Drag and drop album cover image here or click to select file' uploadTextClass='custom-dropzone-text' /> */}
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    </Modal.Body>
                    <Modal.Footer>

                        <Button variant="secondary" onClick={handleClose}>
                            Cancel Changes
                        </Button>

                        <Button variant="danger" onClick={handleClose}>
                            Save Profile
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
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <Image onClick={handleShow} src="https://via.placeholder.com/50" roundedCircle className="pfp" />
                    <a onClick={handleShow} className="text-decoration-none" style={{ color: 'inherit', cursor: 'pointer' }}>
                        {user ? user.name : 'Loading...'}
                    </a>
                </CDBSidebarHeader>
                <Col className="flex-grow-1 d-flex flex-column vh-100" fluid>
                    <Row className="align-items-start">
                        <CDBSidebarContent className="sidebar-content">
                            <CDBSidebarMenu>
                                <nav id="sidebar">
                                    <NavLink to="/home" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="">Home</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="">Podcast</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="">Videocasts</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink to="" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="">Subscription Settings</CDBSidebarMenuItem>
                                    </NavLink>
                                    {isArtist && (
                                        <>
                                            <CDBSidebarHeader className="sub-header"></CDBSidebarHeader>
                                            <CDBSidebarMenuItem icon="" className="sub-header">ARTIST</CDBSidebarMenuItem>
                                            {/* <CDBSidebarMenuItem icon="" className="sub-header">ARTIST</CDBSidebarMenuItem> */}
                                            <NavLink to="/upload" activeClassName="activeClicked">
                                                <CDBSidebarMenuItem icon="">Content</CDBSidebarMenuItem>
                                            </NavLink>
                                        </>
                                    )}
                                    <CDBSidebarHeader className="sub-header"></CDBSidebarHeader>
                                    <NavLink onClick={handleSubmit} activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="">Logout</CDBSidebarMenuItem>
                                    </NavLink>
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