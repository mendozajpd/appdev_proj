import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Sidebar from './sidebar';
import '../css/index.css'; // Import the CSS file

const Banned = () => {
    return (
        <>
            <Sidebar />
            <Container className='manage-users' fluid>
                <Row>
                    <Col>
                        <h1 className="text-white heading">User Management</h1>
                        <div className="row">
                            <div className="col">
                                <div className="container-md p-3 my-2 bg-danger text-white card">
                                    <h1 className="text-white sub-heading">Admin</h1>
                                    <p className="text-dark count">3</p>
                                </div>
                            </div>

                            <div className="col">
                                <div className="container-md p-3 my-2 bg-danger text-white card">
                                    <h1 className="text-white sub-heading">Listeners</h1>
                                    <p className="text-dark count">9,800,567</p>
                                </div>
                            </div>

                            <div className="col">
                                <div className="container-md p-3 my-2 bg-danger text-white card">
                                    <h1 className="text-white sub-heading">Artists</h1>
                                    <p className="text-dark count">9,800,567</p>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <NavLink to="/admin/manage-users" className="text-danger nav-link">Users</NavLink>
                            <NavLink to="/admin/pending-requests" className="text-danger nav-link">Pending Requests</NavLink>
                            <NavLink to="/admin/banned" className="text-white nav-link">Banned</NavLink>
                        </div>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr className='table-danger'>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>john_doe</td>
                                    <td>john@example.com</td>
                                    <td>Inappropriate Videocast</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>jane_smith</td>
                                    <td>jane@example.com</td>
                                    <td>Inappropriate Podcast</td>
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

export default Banned;
