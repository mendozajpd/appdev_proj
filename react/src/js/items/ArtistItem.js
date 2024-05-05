import React, { useState, useEffect } from 'react';
import { Col, Row, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BACKEND_URL from '../../config';

const ArtistItem = ({ onClick, name }) => {

    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/artists`)
            .then(response => {
                const sortedArtists = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setArtists(sortedArtists);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleArtistClick = (artistId) => {
        navigate(`/user/${artistId}`);
      };

    return (
        <>
            {artists.slice(0,15).map((artist, index) => (
                <Card onClick={() => handleArtistClick(artist.id)} key={index} className="bg-dark text-white clickable-hover" style={{ width: '10rem', minWidth: '15rem', minHeight: '10rem' }}>
                    <Card.Body>
                        <Card.Text>
                            <div >
                                <div className='d-flex justify-content-center'>
                                    <Image src="https://via.placeholder.com/150" roundedCircle style={{ maxWidth: 'auto' }} />
                                </div>
                                <div className='d-flex my-2 text-truncate'>
                                    {artist.name} {/* Replace with the actual property for the artist's name */}
                                </div>
                                <div className='text-gray'>
                                    Artist
                                </div>
                            </div>
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </>
    );
}

export default ArtistItem;