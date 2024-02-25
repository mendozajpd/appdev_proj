import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import '../css/index.css'

const Side = props => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Nav className="col-sm-3 d-none d-md-block sidebar"
                activeKey="/home"
                onSelect={selectedKey => {
                    alert(`selected ${selectedKey}`);
                    navigate(selectedKey);
                }}
            >
                <div className="sidebar-sticky"></div>
                <Nav.Item>
                    <Nav.Link href="/home">Active</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Link</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Link</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="disabled" disabled>
                        Disabled
                    </Nav.Link>
                </Nav.Item>
            </Nav>

        </>
    );
};

export default Side;