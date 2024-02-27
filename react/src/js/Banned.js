import React from 'react';
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
import { Image } from 'react-bootstrap';
import Sidebar from './sidebar';


const Banned = () => {
    return (
        <>
            <Sidebar />
            <Container className='manage-users' fluid>
                <Row>
                    <Col>
                        <h1 class="text-white"
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
                            <NavLink to="/admin/pending-requests" className="text-danger" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none', marginRight: '50px' }}>Pending Requests</NavLink>
                            <NavLink to="/admin/banned" className="text-white" style={{ fontWeight: 'bold', fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none' }}>Banned</NavLink>
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
                                    <td>Inaappropriate Videocast</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>jane_smith</td>
                                    <td>jane@example.com</td>
                                    <td>Inaappropriate Podcast</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>mariel</td>
                                    <td>mariel@example.com</td>
                                    <td>Inaappropriate Videocast</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>martin_smith</td>
                                    <td>martin@example.com</td>
                                    <td>Inaappropriate Videocast</td>
                                </tr>

                                <tr>
                                    <td>5</td>
                                    <td>mariel</td>
                                    <td>mariel@example.com</td>
                                    <td>Inaappropriate Podcast</td>
                                </tr>
                                <tr>
                                    <td>6</td>
                                    <td>samanthaclaudine</td>
                                    <td>samanthaclaudinen@example.com</td>
                                    <td>Inaappropriate Videocast</td>
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