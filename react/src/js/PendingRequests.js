// PendingRequests.js
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Sidebar from './sidebar';
import '../css/index.css'; // Import CSS file

const PendingRequests = () => {
    const [users, setUsers] = useState([
        { id: 1, username: 'john_doe', status: 'Not Verified', message: 'This is a sample message for John Doe.' },
        { id: 2, username: 'jane_smith', status: 'Verified', message: 'This is a sample message for Jane Smith.' },
        // Add more users as needed
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    // Function to handle approval
    const handleApprove = (id) => {
        setUsers(users.map(user => user.id === id ? { ...user, status: 'Approved' } : user));
    };

    // Function to handle rejection
    const handleReject = (id) => {
        setUsers(users.map(user => user.id === id ? { ...user, status: 'Rejected' } : user));
    };

    // Function to handle deletion
    const handleDelete = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    // Function to handle row click
    const handleRowClick = (id) => {
        // Add logic here to handle row click
    };

    // Function to handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Sidebar />
            <Container className='manage-users' fluid>
                <Row>
                    <Col>
                        <div className="col">
                            <NavLink to="/admin/manage-users" className="text-danger" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none', marginRight: '50px' }}>Users</NavLink>
                            <NavLink to="/admin/pending-requests" className="text-white" style={{ fontWeight: 'bold', fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none', marginRight: '50px' }}>Pending Requests</NavLink>
                            <NavLink to="/admin/banned" className="text-danger" style={{ fontSize: '30px', transition: 'color 0.3s', textDecoration: 'none' }}>Banned</NavLink>
                        </div>
                        <Form.Group controlId="search">
                            <Form.Control type="text" placeholder="Search by username" value={searchQuery} onChange={handleSearchChange} />
                        </Form.Group>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} onClick={() => handleRowClick(user.id)} className="user-row">
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            <button className="approve-btn" onClick={() => handleApprove(user.id)}>Approve</button>
                                            <button className="reject-btn" onClick={() => handleReject(user.id)}>Reject</button>
                                            <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button> {/* Add delete button */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PendingRequests;
