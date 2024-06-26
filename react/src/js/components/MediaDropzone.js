import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Button, FormControl } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Select from 'react-select';
import BACKEND_URL from "../../config";
import axios from 'axios';



function Basic({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop, onGenreChange, onFileDelete }) {
    const [files, setFiles] = useState([]);
    const [editing, setEditing] = useState(null);
    const [fileName, setFileName] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState({});
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [playingFile, setPlayingFile] = useState(null);
    const playerRefs = useRef({});

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
        onDrop: acceptedFiles => {
            const newFiles = [...files, ...acceptedFiles.map(file => Object.assign(file, {
                id: uuidv4(),
                preview: URL.createObjectURL(file),
                formattedSize: (file.size / 1048576).toFixed(2),
                displayName: file.name.split('.').slice(0, -1).join('.'),  // Add display name
                genres: []
            }))];
            setFiles(newFiles);
            onDrop(newFiles);

            localStorage.setItem('files', JSON.stringify(newFiles));
        }
    });

    const removeFile = file => (event) => {
        event.stopPropagation();
        setFiles(prevFiles => {
            const newFiles = prevFiles.filter(f => f.id !== file.id);
            if (newFiles.length === 0) {
                localStorage.removeItem('files');
            } else {
                localStorage.setItem('files', JSON.stringify(newFiles));
            }
            return newFiles;
        });
    
        onFileDelete(file);
    };

    const handleFileNameChange = (e, index) => {
        const newDisplayName = e.target.value;
        let newFiles = [...files];
        newFiles[index].displayName = newDisplayName;
        setFiles(newFiles);
    };

    const handleBlur = () => {
        setEditing(null);
    };

    const handleGenreChange = (file) => (selectedOptions) => {
        setSelectedGenres(prev => {
            const newGenres = { ...prev, [file.path]: selectedOptions };
            //console.log(newGenres);  // Log the new genres
            onGenreChange(newGenres);
            return newGenres;
        });

        // Update the genres in the file
        const newFiles = files.map(f => f.path === file.path ? { ...f, genres: selectedOptions } : f);
        setFiles(newFiles);
        localStorage.setItem('files', JSON.stringify(newFiles));
    };

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

    const filesView = files.map((file, index) => (
            <React.Fragment key={file.id} >
                <Row className="mb-2 files-view" onClick={(e) => e.stopPropagation()}>
                    <Col className='d-flex flex-column justify-content-start'>
                        <Row className='d-flex flex-nowrap'>
                            <Col xs={1} className='d-flex justify-content-start mb-2 align-items-center'>
                                {index + 1}
                            </Col>
                            <Col xs={6} className='d-flex align-items-end flex-column'>
                                <Row className='w-100'>
                                    <FormControl
                                        value={file.displayName}
                                        onChange={(event) => handleFileNameChange(event, index)}
                                        onBlur={handleBlur}
                                        className='input-style'
                                        placeholder="Song name"
                                    />
                                    {file.isNameEmpty && <div>Song name can't be empty</div>}
                                </Row>
                                <Row className='w-100'>
                                    <AudioPlayer
                                        ref={c => playerRefs.current[file.path] = c}
                                        src={file.preview}
                                        layout="horizontal"
                                        className='player-borderless'
                                        customAdditionalControls={[]}
                                        customVolumeControls={[]}
                                        showJumpControls={false}
                                        onPlay={() => {
                                            // Pause the previously playing audio
                                            if (playingFile && playingFile !== file.path && playerRefs.current[playingFile]) {
                                                playerRefs.current[playingFile].audio.current.pause();
                                            }
                                            // Set the currently playing audio
                                            setPlayingFile(file.path);
                                        }}
                                    />
                                </Row>
                            </Col>
                            <Col xs={4} className='d-flex align-items-center' >
                                <Row className='w-100'>
                                    <Select
                                        isMulti
                                        styles={styles}
                                        closeMenuOnSelect={false}
                                        options={options}
                                        placeholder='Genre'
                                        value={file.genres}
                                        onChange={handleGenreChange(file)}
                                        maxMenuHeight={125}
                                    />
                                </Row>
                            </Col>

                            <Col xs={1} className='d-flex justify-content-center align-items-center'>
                                <Button className='fa fa-times p-2 btn-preview-delete' variant='transparent outline-danger' onClick={removeFile(file)} />
                            </Col>
                        </Row>
                        <Row>
                        </Row>
                    </Col>
                </Row>
            </React.Fragment>
    ));

    const filesAddMore = (
        <Row className="mb-2 files-view" style={{ cursor: 'pointer', color: 'gray' }}>
            <Col className='d-flex flex-column justify-content-start'>
                <Row className='d-flex flex-nowrap'>
                    <Col xs={12} className='d-flex justify-content-center align-items-center'>
                        <i className="fa fa-plus-square px-2" aria-hidden="true" />
                        Add more songs here
                    </Col>
                </Row>
            </Col>
        </Row>
    );


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
                        <Row>
                            <i className={iconClass} style={iconStyle} aria-hidden="true" />
                            <Row className={uploadTextClass}>
                                {uploadText}
                            </Row>
                        </Row>
                    </Col>
                ) : (
                    <Col className='px-3 py-1'>
                        <Row className='justify-content-center align-items-center d-flex flex-grow-1'>
                            {filesView}
                            {filesAddMore}
                        </Row>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

const MediaDropzone = ({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop, onGenreChange, onFileDelete }) => (
    <Basic uploadText={uploadText} uploadTextClass={uploadTextClass} iconClass={iconClass} iconSize={iconSize} activeStyle={activeStyle} acceptStyle={acceptStyle} onDrop={onDrop} onGenreChange={onGenreChange} onFileDelete={onFileDelete} />
);

export default MediaDropzone;