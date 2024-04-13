import { Outlet, useNavigate } from "react-router-dom";
import UserSidebar from "../UserSidebar";
import { useEffect, useState, useContext } from "react";
import MusicPlayer from "../MusicPlayer";
import axios from "axios";
import BACKEND_URL from "../../config";

// Context
import PlayerContext from "../context/PlayerContext";
import { Container } from "react-bootstrap";


const UserLayout = () => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const { songID } = useContext(PlayerContext);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');

        if (storedToken) {
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

    return (

        <div className="home-page d-flex vh-100">
            <UserSidebar />
            <Container className="g-0" fluid>
                <div className="home-page-content">
                    <Outlet />
                    <MusicPlayer songID={songID}  />
                </div>
            </Container>
        </div>
    );
}

export default UserLayout;