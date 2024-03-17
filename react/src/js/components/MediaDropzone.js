import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function Basic({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop }) {
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
        accept: {
            'audio/mp3': ['.mp3'],
        },
        onDrop: acceptedFiles => {
            setFiles(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: (file.size / 1048576).toFixed(2)
            }))]);
            onDrop(acceptedFiles);
        }
    });

    const removeFile = file => (event) => {
        event.stopPropagation();
        const newFiles = [...files];
        newFiles.splice(newFiles.indexOf(file), 1);
        setFiles(newFiles);
    };

    const filesView = files.map((file, index) => (
        <React.Fragment key={`${file.path}-${index}`}>
            <Row className="mb-2 files-view" onClick={(e) => e.stopPropagation()}>
                <Col className='d-flex flex-column justify-content-start'>
                    <Row className='d-flex flex-nowrap'>
                        <Col className='d-flex justify-content-start align-items-center'>
                            <h5 className='upload-preview'>{file.path}</h5>
                        </Col>
                        <Col xs={2} className='d-flex justify-content-start align-items-center'>
                            <h5> {file.formattedSize} MB </h5>
                        </Col>
                        <Col xs={1}>
                            <Button className='fa fa-times p-2 btn-preview-delete' variant='danger' onClick={removeFile(file)} />
                        </Col>
                    </Row>
                    <Row>
                        <AudioPlayer src={file.preview} layout="horizontal" className='player-borderless' />
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    ));

    const style = useMemo(() => ({
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
    }), [isDragActive, isDragAccept, activeStyle, acceptStyle]);

    const iconStyle = useMemo(() => ({
        fontSize: iconSize,
        animation: isDragActive ? 'bounce 0.5s infinite' : 'none'
    }), [iconSize, isDragActive]);


    return (
        <Container>
            <Row {...getRootProps({ className: 'dropzone media-dropzone vh-20', style })}>
                <input {...getInputProps()} />
                {files.length === 0 ? (
                    <Col className='d-flex align-items-center justify-content-center p-5 flex-column'>
                        <Row>
                            <i className={iconClass} style={iconStyle} aria-hidden="true" />
                            <Row className={uploadTextClass}>
                                {uploadText}
                            </Row>
                        </Row>
                    </Col>
                ) : (
                    <Col className='p-3'>
                        <Row className='justify-content-center align-items-center d-flex flex-grow-1'>
                            {filesView}
                        </Row>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

const MediaDropzone = ({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop }) => (
    <Basic uploadText={uploadText} uploadTextClass={uploadTextClass} iconClass={iconClass} iconSize={iconSize} activeStyle={activeStyle} acceptStyle={acceptStyle} onDrop={onDrop} />
);

export default MediaDropzone;