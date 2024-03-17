import { Row, Col, Image, Form } from 'react-bootstrap';

const AlbumItem = ({ album }) => (
    <Row className="p-2">
        <Col className="justify-content-center d-flex align-items-center" xs={1}>
            <Form.Check />
        </Col>
        <Col>
            <Image
                src={`http://127.0.0.1:8000/storage/album_images/${album.cover_photo_hash}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '2%' }}
            />
        </Col>
        <Col className="d-flex align-items-center justify-content-start">
            {album.album_name}
        </Col>
        <Col className='d-flex align-items-center'>
            {album.album_description}
        </Col>
        <Col className="d-flex align-items-center">
            {
                new Date(album.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }
        </Col>
        <Col className="d-flex align-items-center">
            {album.is_published ? "Published" : "Draft"}
        </Col>
        <Col className="d-flex align-items-center">
            {/* {album.listens} */}
            listens
        </Col>
        <Col className="d-flex align-items-center">
            {/* {album.likes} */}
            likes
        </Col>
    </Row>
);

export default AlbumItem;