import React, { useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarMenuItem,
    CDBSidebarMenu,
    CDBSidebarHeader
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import '../css/index.css';
import { Image, Button } from 'react-bootstrap'; // Import Button component from react-bootstrap

const PendingRequests = () => {
    const [statuses, setStatuses] = useState({
        john_doe: 'Not Verified',
        jane_smith: 'Verified'
        // Add more rows as needed
    });

    // Function to handle approval
    const handleApprove = (username) => {
        setStatuses(prevStatuses => ({
            ...prevStatuses,
            [username]: 'Approved' // Update status to 'Approved' for the given username
        }));
    };

    // Function to handle rejection
    const handleReject = (username) => {
        setStatuses(prevStatuses => ({
            ...prevStatuses,
            [username]: 'Rejected' // Update status to 'Rejected' for the given username
        }));
    };

    return (
        <>
            <CDBSidebar textColor="#fff" backgroundColor="#333" className="sidebar">
                <Image
                    src="/register/logo-white.png"
                    roundedCircle
                    className="Register-apple"
                    style={{
                        width: "50px", // Change the width to your desired value
                        height: "50px", // Change the height to your desired value
                        marginLeft: "auto", // Auto margin on left and right to center horizontally
                        marginRight: "auto",
                        marginTop: "10px", // Adjust as needed
                        // marginBottom: "10px"
                    }}
                />

                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                        User Management
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink exact to="/" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Home</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/admin/dashboard" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="user">Admin Dashboard</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/admin/manage-users" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="user">Manage Users</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/tickets" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="table">Tickets</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/revenue" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Revenue</CDBSidebarMenuItem>
                        </NavLink>
                    </CDBSidebarMenu>
                </CDBSidebarContent>
            </CDBSidebar>
            <Container fluid>
                <Row>
                    <Col>
                        <h1 class="text-danger"
                            style={{ fontSize: '50px', transition: 'color 0.3s', textDecoration: 'none' }}>User Management</h1>
                        <div className="row">
                            <div className="col"
                                style={{ marginBottom: '30px' }}>
                                <div className="container-md p-3 my-2 bg-danger text-white"
                                    style={{ borderRadius: '10px', padding: '10px', backgroundColor: '#333' }}>
                                    <h1 className="text-white" style={{ marginTop: 'none', fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none' }}>Admin</h1>
                                    <p className="text-dark" style={{ textAlign: 'center', fontSize: '50px', fontWeight: 'bold' }}>3</p> {/* Add margin-left */}
                                </div>
                            </div>

                            <div className="col"
                                style={{ marginBottom: '30px' }}>
                                <div className="container-md p-3 my-2 bg-danger text-white"
                                    style={{ borderRadius: '10px', padding: '10px', backgroundColor: '#333' }}>
                                    <h1 className="text-white" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none' }}>Listeners</h1>
                                    <p className="text-dark" style={{ textAlign: 'center', fontSize: '50px', fontWeight: 'bold' }}>9,800,567</p> {/* Add margin-left */}
                                </div>
                            </div>

                            <div className="col"
                                style={{ marginBottom: '30px' }}>
                                <div className="container-md p-3 my-2 bg-danger text-white"
                                    style={{ borderRadius: '10px', padding: '10px', backgroundColor: '#333' }}>
                                    <h1 className="text-white" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none' }}>Artists</h1>
                                    <p className="text-dark" style={{ textAlign: 'center', fontSize: '50px', fontWeight: 'bold' }}>9,800,567</p> {/* Add margin-left */}
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <NavLink to="/admin/manage-users" className="text-danger" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none', marginRight: '50px' }}>Users</NavLink>
                            <NavLink to="/admin/pending-requests" className="text-white" style={{ fontWeight: 'bold', fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none', marginRight: '50px' }}>Pending Requests</NavLink>
                            <NavLink to="/admin/banned" className="text-danger" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none' }}>Banned</NavLink>
                        </div>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr className='table-danger'>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th> {/* Add a new column for actions */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>john_doe</td>
                                    <td>john@example.com</td>
                                    <td>Admin</td>
                                    <td>Not Verified</td>
                                    <td>
                                        <Button variant="success" style={{ marginRight: '10px' }}>Approve</Button>
                                        <Button variant="danger">Reject</Button>
                                    </td>

                                </tr>
                                <tr>
                                    <td>jane_smith</td>
                                    <td>jane@example.com</td>
                                    <td>User</td>
                                    <td>Verified</td>
                                    <td>
                                        <Button variant="success" className="approve-button">Approve</Button>
                                        <Button variant="danger">Reject</Button>
                                    </td>

                                </tr>
                                {/* Add more rows as needed */}
                            </tbody>
                        </Table>

                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PendingRequests;
