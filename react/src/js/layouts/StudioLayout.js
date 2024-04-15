import { Outlet, useNavigate } from "react-router-dom";
import { Container, Row, Button, Image } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import MusicPlayer from "../MusicPlayer";
import axios from "axios";
import BACKEND_URL from "../../config";

// Components
import StudioSidebar from "../StudioSidebar";
import StudioTopNav from "../StudioTopNav";

// Context
import StudioContext from "../context/StudioContext";


const StudioLayout = () => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const navigate = useNavigate();


    const [sidebarToggled, setSidebarToggled] = useState(false);


    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');

        if (storedToken) {
            fetchUserDetails();

            axios.get(`${BACKEND_URL}/api/role`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            })
                .then(response => {
                    // console.log('Role:', response.data);
                    setToken(storedToken);
                })
                .catch(error => {
                    console.error('Error fetching role:', error);
                    localStorage.removeItem('jwt_token');
                    setToken(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            console.log('Token does not exist');
            navigate('/login');
            setIsLoading(false);
        }

        
    }, []);

    const [user, setUser] = useState(null);
    const [isArtist, setIsArtist] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    
    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data;
            if (userData === null) {
                localStorage.removeItem('jwt_token');
            } else {
                setUser(userData);
                setIsArtist(userData.role === 'artist');
                setIsVerified(userData.email_verified_at !== null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    return (
        <div className="home-page d-flex vh-100">
            <StudioContext.Provider value={{ sidebarToggled, setSidebarToggled, user }}>
                <StudioTopNav />
                <StudioSidebar />
                <Container className="g-0 overflow-hidden" fluid>
                    <div className="home-page-content mt-5">
                        <Outlet />
                    </div>
                </Container>
            </StudioContext.Provider>
        </div>
    );
}

export default StudioLayout;