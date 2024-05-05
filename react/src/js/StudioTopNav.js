import { Outlet, useNavigate } from "react-router-dom";
import { Container, Row, Button, Image, Dropdown } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

// CONTEXT
import StudioContext from "./context/StudioContext";



const StudioTopNav = () => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [refreshSidebar, setRefreshSidebar] = useState(false);

    const navigate = useNavigate();

    const { sidebarToggled, setSidebarToggled, user } = useContext(StudioContext);

    const handleShowSidebar = () => {
        setSidebarToggled(prevState => !prevState);
    }

    const [logoutDisabled, setLogoutDisabled] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        setLogoutDisabled(true);
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.post(
                `${BACKEND_URL}/api/auth/logout`,
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
            console.error("Login failed:", error);
            setLogoutDisabled(false);
        }
    };

    const handleUpload = () => {
        localStorage.setItem('showUpload', 'true');
        navigate('/studio/content');
    }


    return (
        <Row className="top-nav position-fixed g-0">
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center studio-logo mx-4">
                    <Button variant="outline" className="mx-2 text-white" onClick={() => { handleShowSidebar() }}>
                        <i className="fa fa-bars" aria-hidden="true" />
                    </Button>
                    <Image
                        src="/register/logo-white.png"
                        roundedCircle
                        onClick={() => navigate('')}
                        style={{
                            width: "50px",
                            height: "50px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            cursor: 'pointer'
                        }}
                    />
                    <div className="mx-2 clickable" onClick={() => navigate('/studio')}>
                        STUDIO
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    {/* <Button className="btn btn-outline-danger" onClick={() => { handleShow(); resetUpload(); setIsCreateAlbumButtonDisabled(false); }}> */}
                    <Button onClick={() => handleUpload()} className="btn btn-outline-danger" >
                        <i className="fa fa-plus-square px-2" aria-hidden="true" />
                        CREATE
                    </Button>
                    <div className="mx-3 clickable">
                        <Dropdown className="profile-dropdown">
                            <Dropdown.Toggle id="dropdown-basic">
                                <Image src="https://via.placeholder.com/40" roundedCircle className="pfp" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="dark">
                                <Dropdown.Item onClick={() => navigate(`/user/${user.id}`)}>
                                    <i className="fa fa-user mx-2 text-white"></i>
                                    Your Profile
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/')}>
                                    <i className="fa fa-ship mx-2 text-white"></i>
                                    MediaHarbor
                                </Dropdown.Item>
                                <Dropdown.Item href="/settings" disabled>
                                    <i className="fa fa-cog mx-2 text-white"></i>
                                    Settings
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout} disabled={logoutDisabled}>
                                    <i className="fa fa-sign-out mx-2 text-white"></i>
                                    Log out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </Row>
    );
}

export default StudioTopNav;