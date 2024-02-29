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
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5); // Change this value to adjust the number of users per page

    // Function to handle approval
    const handleApprove = (id) => {
        const updatedUsers = users.map(user => {
            if (user.id === id) {
                return { ...user, status: 'Approved' };
            }
            return user;
        });
        setUsers(updatedUsers);
        // Add the approved user to the list of all users
        setAllUsers(prevAllUsers => [...prevAllUsers, users.find(user => user.id === id)]);
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

    // Calculate index of the last user on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    // Calculate index of the first user on the current page
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    // Get users for the current page
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Function to handle pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // State to store all users
    const [allUsers, setAllUsers] = useState([]);

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
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr className='table-danger'>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map(user => (
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

export default PendingRequests;
