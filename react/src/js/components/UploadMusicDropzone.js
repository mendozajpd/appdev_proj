import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Button, FormControl, Spinner } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import 'react-h5-audio-player/lib/styles.css';
import BACKEND_URL from "../../config";
import axios from 'axios';
import { handleCreateAlbum } from '../services/StudioServices';

import { useNavigate } from 'react-router-dom';


function Basic({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop, closeModal }) {
    const [files, setFiles] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState({});

    const navigate = useNavigate();

    useEffect(() => {

        // Load the files from localStorage
        const savedFiles = JSON.parse(localStorage.getItem('files')) || [];
        setFiles(savedFiles);

        // Load the genres from the files
        const savedGenres = savedFiles.reduce((acc, file) => {
            acc[file.path] = file.genres;
            return acc;
        }, {});
        setSelectedGenres(savedGenres);

        axios.get(`${BACKEND_URL}/api/genres`)
            .then(response => {
                const genres = response.data;
                const options = genres.map(genre => ({ value: genre.id, label: genre.name }));
                setOptions(options);
            });
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
        accept: {
            'audio/mp3': ['.mp3'],
        },
        onDrop: async acceptedFiles => {
            const newFiles = [...files, ...acceptedFiles.map(file => Object.assign(file, {
                id: uuidv4(),
                preview: URL.createObjectURL(file),
                formattedSize: (file.size / 1048576).toFixed(2),
                displayName: file.name.split('.').slice(0, -1).join('.'),  // Add display name
                genres: []
            }))];
            setFiles(newFiles);
            onDrop(newFiles);
    
            console.log('newfiles', newFiles);
            const albumID = await handleCreateAlbum(newFiles);
            navigate(`/studio/album/${albumID.album_id}`);
            closeModal();
        }
    });


    const styles = {
        valueContainer: (base) => ({
            ...base,
            maxHeight: 80,
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #333",
            "::webkit-scrollbar": {
                width: "8px"
            },
            "::webkit-scrollbar-thumb": {
                background: "#888"
            },
            "::webkit-scrollbar-thumb:hover": {
                background: "#555"
            }
        }),

        multiValue: (base, state) => {
            return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
        },
        multiValueLabel: (base, state) => {
            return state.data.isFixed
                ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
                : base;
        },
        multiValueRemove: (base, state) => {
            return state.data.isFixed ? { ...base, display: "none" } : base;
        },
        control: base => ({
            ...base,
            backgroundColor: '#333',
            color: 'white'
        }),
        menu: base => ({
            ...base,
            backgroundColor: '#333',
            color: 'white',
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #333",
            "::webkit-scrollbar": {
                width: "8px"
            },
            "::webkit-scrollbar-thumb": {
                background: "#888"
            },
            "::webkit-scrollbar-thumb:hover": {
                background: "#555"
            }
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'black' : 'white',
            backgroundColor: state.isSelected ? 'gray' : '#333',
            "&:hover": {
                backgroundColor: '#555'
            }
        }),
        input: (provided, state) => ({
            ...provided,
            color: 'white',
        }),
    };

    const style = useMemo(() => ({
        ...(isDragActive ? { ...activeStyle, backgroundColor: 'lightgray' } : {}),
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
                        <Row style={{ height: '10rem' }}>
                            <i className={iconClass} style={iconStyle} aria-hidden="true" />
                            <Row className={uploadTextClass}>
                                {uploadText}
                            </Row>
                        </Row>
                    </Col>
                ) : (
                    <Col className='px-3 py-1'>
                        <Row className='justify-content-center align-items-center d-flex' style={{ height: '15rem' }}>
                            <div className='d-flex justify-content-center'>
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                <div className='px-3 align-items-center d-flex'>
                                    UPLOADING
                                </div>
                            </div>
                        </Row>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

const UploadMusicDropzone = ({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop, onGenreChange, onFileDelete, closeModal }) => (
    <Basic uploadText={uploadText} uploadTextClass={uploadTextClass} iconClass={iconClass} iconSize={iconSize} activeStyle={activeStyle} acceptStyle={acceptStyle} onDrop={onDrop} onGenreChange={onGenreChange} onFileDelete={onFileDelete} closeModal={closeModal} />
);

export default UploadMusicDropzone;