import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import '../css/index.css'

const Side = props => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Nav className="col-sm-3 d-none d-md-block sidebar justify-content-center align-items-center flex-grow-1" // Add justify-content-center and align-items-center classes
                activeKey="/home"
                onSelect={selectedKey => {
                    // alert(`selected ${selectedKey}`);
                    navigate(selectedKey);
                }}
            >
                <div className="sidebar-sticky"></div>
                <div className="sidebar-logo">
                    <Nav.Item>
                        <img
                            src={process.env.PUBLIC_URL + "/register/logo.png"}
                            alt="MediaHarbor Logo"
                            // className="mr-2"
                            style={{
                                margin: "flex",
                            }}
                        />
                    </Nav.Item>
                </div>
                <Nav.Item>
                    <div className="nav-center">
                        <Nav.Link href="/admin/dashboard">Dashboard</Nav.Link>
                    </div>
                </Nav.Item>
                <Nav.Item>
                    <div className="nav-center">
                        <Nav.Link href="/admin/manage-users">Manage Users</Nav.Link>
                    </div>
                </Nav.Item>
                <Nav.Item>
                    <div className="nav-center">
                        <Nav.Link eventKey="disabled" disabled>Temp</Nav.Link>
                    </div>
                </Nav.Item>
                <Nav.Item>
                    <div className="nav-center">
                        <Nav.Link eventKey="disabled" disabled>
                            Temp
                        </Nav.Link>
                    </div>
                </Nav.Item>
            </Nav>

        </>
    );
};

export default Side;