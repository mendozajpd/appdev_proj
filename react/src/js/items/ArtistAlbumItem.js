import React from 'react';
import { Col, Row, Image } from 'react-bootstrap';
import BACKEND_URL from '../../config';

const ArtistAlbumItem = ({ album }) => {
    return (
        <div className="artist-album-item ">
            <Col className="p-2">
                <div className="d-flex justify-content-center mb-2">
                    <Image src={`${BACKEND_URL}/storage/album_images/${album.cover_photo_hash}`} rounded className="artist-album-photo" />
                </div>
                <Row className="justify-content-center d-flex">
                    {album.album_name}
                </Row>
            </Col>
        </div>
    );
}

export default ArtistAlbumItem;