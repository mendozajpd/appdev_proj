import React, { useState } from 'react';
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Sidebar from './sidebar';
import '../css/index.css'; // Import CSS file

const AdminManageUsers = () => {
    // Define sample users data for demonstration
    const users = [
        { username: 'john_doe', email: 'john@example.com', role: 'Admin', status: 'Unverified' },
        { username: 'jane_smith', email: 'jane@example.com', role: 'User', status: 'Verified' },
        { username: 'mariel', email: 'mariel@example.com', role: 'Admin', status: 'Unverified' },
        { username: 'martin_smith', email: 'martin@example.com', role: 'User', status: 'Verified' },
        { username: 'mariel', email: 'mariel@example.com', role: 'Admin', status: 'Unverified' },
        { username: 'samanthaclaudine', email: 'samanthaclaudinen@example.com', role: 'User', status: 'Unverified' }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5); // Change this value to adjust the number of users per page

    // Function to handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset current page when search query changes
    };

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate index of the last user on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    // Calculate index of the first user on the current page
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    // Get users for the current page
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Function to handle pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <>
            <Sidebar />
            <Container className='manage-users' fluid>
                <Row>
                    <Col>
                        <h1 className="text-white heading">User Management</h1>
                        <div className="row">
                            <div className="col">
                                <div className="container-md p-3 my-2 bg-danger text card">
                                    <h1 className="sub-heading">Admin</h1>
                                    <p className="text-dark">3</p>
                                </div>
                            </div>

                            <div className="col">
                                <div className="container-md p-3 my-2 bg-danger text card">
                                    <h1 className="sub-heading">Listeners</h1>
                                    <p className="text-dark">9,800,567</p>
                                </div>
                            </div>

                            <div className="col">
                                <div className="container-md p-3 my-2 bg-danger text card">
                                    <h1 className="sub-heading">Artists</h1>
                                    <p className="text-dark">9,800,567</p>
                                </div>
                            </div>
                        </div>

                        {/* Search bar */}
                        <Form>
                            <Form.Group controlId="search">
                                <Form.Control
                                    type="text"
                                    placeholder="Search by username"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </Form.Group>
                        </Form>

                        <div className="col">
                            <NavLink to="/admin/manage-users" className="col-link">All Users</NavLink>
                            <NavLink to="/admin/pending-requests" className="col-link">Pending Requests</NavLink>
                            <NavLink to="/admin/banned" className="col-link">Banned Lists</NavLink>
                        </div>
                        {/* Table */}
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
                                {filteredUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {/* Pagination */}
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                                    <li key={i} className="page-item">
                                        <button onClick={() => paginate(i + 1)} className="page-link">
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminManageUsers;
