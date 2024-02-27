import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Sidebar from './sidebar';


const AdminManageUsers = () => {
    return (
        <>
            <Sidebar />
            <Container className='manage-users' fluid>
                <Row>
                    <Col>
                        <h1 class="text-white"
                            style={{ fontSize: '50px', transition: 'color 0.3s', textDecoration: 'none' }}>User Management
                        </h1>
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
                            <NavLink to="/admin/manage-users" className="text-white" style={{ fontWeight: 'bold', fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none', marginRight: '50px' }}>Users</NavLink>
                            <NavLink to="/admin/pending-requests" className="text-danger" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none', marginRight: '50px' }}>Pending Requests</NavLink>
                            <NavLink to="/admin/banned" className="text-danger" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none' }}>Banned</NavLink>
                        </div>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr className='table-danger'>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>john_doe</td>
                                    <td>john@example.com</td>
                                    <td>Admin</td>
                                    <td>Unverified</td>
                                </tr>
                                <tr>
                                    <td>jane_smith</td>
                                    <td>jane@example.com</td>
                                    <td>User</td>
                                    <td>Verified</td>
                                </tr>
                                <tr>
                                    <td>mariel</td>
                                    <td>mariel@example.com</td>
                                    <td>Admin</td>
                                    <td>Unverified</td>
                                </tr>
                                <tr>
                                    <td>martin_smith</td>
                                    <td>martin@example.com</td>
                                    <td>User</td>
                                    <td>Verified</td>
                                </tr>

                                <tr>
                                    <td>mariel</td>
                                    <td>mariel@example.com</td>
                                    <td>Admin</td>
                                    <td>Unverified</td>
                                </tr>
                                <tr>
                                    <td>samanthaclaudine</td>
                                    <td>samanthaclaudinen@example.com</td>
                                    <td>User</td>
                                    <td>Unverified</td>
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

export default AdminManageUsers;
