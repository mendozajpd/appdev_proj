import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col } from 'react-bootstrap';

function Basic({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle }) {
    const [files, setFiles] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles);
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setBackgroundImage(fileReader.result);
            };
            fileReader.readAsDataURL(acceptedFiles[0]);
        },
    });
    const style = useMemo(() => ({
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }), [isDragActive, isDragAccept, activeStyle, acceptStyle, backgroundImage]);

    const iconStyle = useMemo(() => ({
        fontSize: iconSize,
        animation: isDragActive ? 'bounce 0.5s infinite' : 'none'
    }), [iconSize, isDragActive]);

    return (
        <Container fluid>
            <Row {...getRootProps({ className: 'dropzone custom-dropzone vh-20', style })}>
                <input {...getInputProps()} />
                <Col className='d-flex justify-content-center align-items-center p-5 flex-column'>
                    {
                        backgroundImage ? (
                            <>
                                <Row>
                                    <i className={iconClass} style={iconStyle} aria-hidden="true" />
                                </Row>
                                <Row className={uploadTextClass}>
                                    {uploadText}
                                </Row>
                            </>
                        ) : (
                            <>
                                <Row>
                                    <i className={iconClass} style={iconStyle} aria-hidden="true" />
                                </Row>
                                <Row className={uploadTextClass}>
                                    {uploadText}
                                </Row>
                            </>
                        )
                    }

                </Col>
            </Row>
            {/* <Row>
                <h4>Files</h4>
                <ul>{files}</ul>
            </Row> */}
        </Container>
    );
}

const AlbumCoverDropzone = ({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle }) => (
    <Basic uploadText={uploadText} uploadTextClass={uploadTextClass} iconClass={iconClass} iconSize={iconSize} activeStyle={activeStyle} acceptStyle={acceptStyle} />
);

export default AlbumCoverDropzone;