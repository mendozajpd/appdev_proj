import React, { useState, useEffect } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import '../css/index.css'
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarMenuItem,
    CDBSidebarMenu,
    CDBSidebarHeader
} from 'cdbreact';
import { Image } from 'react-bootstrap';
import { Container, Row, Col, Table } from 'react-bootstrap';
import axios from "axios";
import BACKEND_URL from "../config";

const Sidebar = props => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token && location.pathname !== '/login') {
            navigate('/login');
        } else {
            fetchUserDetails();
        }
    }, []);

    const [isVerified, setIsVerified] = useState(false);
    const [logoutDisabled, setLogoutDisabled] = useState(false);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.get(`${BACKEND_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data;
            console.log(userData);
            setIsVerified(userData.email_verified_at !== null);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLogoutDisabled(true);
        try {
            const token = localStorage.getItem("jwt_token");
            await axios.post(
                `${BACKEND_URL}/auth/logout`,
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
            console.error("Logout failed:", error);
            setLogoutDisabled(false);
        }
    };

    return (
        <>
            <CDBSidebar textColor="#fff" backgroundColor="#282626" className="sidebar position-fixed">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <NavLink to="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                        SUPER ADMIN
                    </NavLink>
                </CDBSidebarHeader>
                <Col className="flex-grow-1 d-flex flex-column vh-100" fluid={true}>
                    <Row className="align-items-start">
                        <CDBSidebarContent className="sidebar-content">
                            <CDBSidebarMenu>
                                <nav id="sidebar">
                                    <NavLink exact to="/admin" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="home">Dashboard</CDBSidebarMenuItem>
                                    </NavLink>

                                    <NavDropdown title={<span className="nav-dropdown-title"><i className="fa fa-user"></i>Profiles</span>} id="basic-nav-dropdown">
                                        <NavDropdown.Item as={NavLink} exact to="/adminprofile" activeClassName="activeClicked">Admin Profile</NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} exact to="/profile-management" activeClassName="activeClicked">Profile Management</NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} exact to="/admin/manage-users" activeClassName="activeClicked">Manage Users</NavDropdown.Item>
                                    </NavDropdown>

                                    <NavLink exact to="/tickets" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="table">Subscription Settings</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/revenue" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="columns">Revenue</CDBSidebarMenuItem>
                                    </NavLink>
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
export default Sidebar;
