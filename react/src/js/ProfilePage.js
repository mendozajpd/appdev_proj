import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from './sidebar';
import '../css/index.css'; // Import CSS file

const ProfilePage = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const userProfileImage = process.env.PUBLIC_URL + "/register/profile1.jpg";

    return (
        <>
            <Sidebar />
            {/* <scrollbars></scrollbars> */}
            <Container className='profile-container'>
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={userProfileImage}
                        alt="Profile Picture of John Doe"
                        className="profile-picture"
                    />
                    <div className="profile-details ">

                        <h2 className="profile-name">John Doe</h2>
                        <p className="profile-bio">Software Developer/Admin</p>
                        <p className="profile-role">Executive Vice President of Admission</p>

                        <Container className='employe-contacts'>
                            <p className="contact">Contacts</p>
                            <div className="d-flex flex-row align-items-center">

                                {/* <h3 className="name d-flex flex-column">Name: John Doe</h3>
                                <h4 className="role"> Role:Admin </h4>
                                <p className="is_approved d-flex flex-column"></p>
                                <p className="is_deactivated"></p> */}

                                <a
                                    href="johndoe@gmail.com" // Replace with the actual URL you want to link to
                                    target="_blank" // Opens the link in a new tab
                                    rel="noopener noreferrer" // Security attributes for external links
                                    className="social-button contact-socialmed btn-sm"
                                >
                                    <img
                                        src={process.env.PUBLIC_URL + "/register/google.png"}
                                        alt="Google Logo"
                                        className="contact-socialmed"
                                    />
                                    johndoe@gmail.com
                                </a>


                                <a
                                    href="Phone number" // Replace with the actual URL you want to link to
                                    target="_blank" // Opens the link in a new tab
                                    rel="noopener noreferrer" // Security attributes for external links
                                    className="social-button contact-socialmed btn-sm"
                                >
                                    <img
                                        src={process.env.PUBLIC_URL + "/register/mobile.jpg"}
                                        alt="Google Logo"
                                        className="contact-socialmed"
                                    />
                                    09645123554
                                </a>


                                <a
                                    href="https://www.facebook.com" // Replace with the actual URL you want to link to
                                    target="_blank" // Opens the link in a new tab
                                    rel="noopener noreferrer" // Security attributes for external links
                                    className="social-button contact-socialmed btn-sm login-facebook"
                                >
                                    <img
                                        src={process.env.PUBLIC_URL + "/register/facebook.png"}
                                        alt="Facebook Logo"
                                        className="contact-socialmed"
                                    />
                                    John Doe Abanilla
                                </a>
                            </div>

                            <div className='interests'>
                                <h1>Interests</h1>
                                <ul>
                                    <li>Videocast</li>
                                    <li>Podcast</li>
                                    <li>Alternative Rock</li>
                                    <li>Pop</li>
                                </ul>
                            </div>

                            <Container className='employe-details'>
                                <div>
                                    <h2 className="profile-about text-white">About</h2>

                                    <p className="About">John Doe is a passionate and dedicated professional with over a decade of experience in the tech industry.
                                        Specializing in software development and web technologies, he has a proven track record of delivering innovative solutions that drive
                                        business growth and efficiency. With a keen eye for detail and a commitment to excellence, John is known for his ability to lead teams,
                                        manage projects, and foster a collaborative environment that encourages creativity and innovation. His expertise spans across various programming languages,
                                        frameworks, and tools, making him a versatile asset to any project. John's dedication to continuous learning and staying updated with the
                                        latest industry trends ensures that he brings the most cutting-edge solutions to the table. Outside of his professional life, John is an avid hiker
                                        and photographer, capturing the beauty of nature through his lens and sharing his adventures with the world.</p>
                                    {/* <p className="profile-bio"></p> */}
                                </div>
                            </Container>
                        </Container>
                    </div>
                </div>
            </Container>
            {/* {error && <p>Error: {error}</p>} */}
        </>
    );
};

export default ProfilePage;
