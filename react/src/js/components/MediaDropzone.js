import React, { useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Button, FormControl } from 'react-bootstrap';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Select from 'react-select';
import BACKEND_URL from "../../config";
import axios from 'axios';



function Basic({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop, onGenreChange }) {
    const [files, setFiles] = useState([]);
    const [editing, setEditing] = useState(null);
    const [fileName, setFileName] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState({});
    const [isNameEmpty, setIsNameEmpty] = useState(false);


    useEffect(() => {
        axios.get(`${BACKEND_URL}/genres`)
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
            setFiles(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: (file.size / 1048576).toFixed(2),
                displayName: file.name.split('.').slice(0, -1).join('.')  // Add display name
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

    const handleDoubleClick = (file, index) => {
        setEditing(index);
        setFileName(file.displayName);  // Edit display name
    };

    const handleFileNameChange = (file) => (event) => {
        const name = event.target.value;
        const newFiles = files.map((f) => {
            if (f === file) {
                return { ...f, displayName: name, isNameEmpty: name.trim() === '' };
            }
            return f;
        });
        setFiles(newFiles);
    };

    const handleBlur = () => {
        setEditing(null);
    };

    const handleKeyDown = (event, file, index) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleBlur(file, index);
        }
    };

    const handleGenreChange = (file) => (selectedOptions) => {
        setFiles(prevFiles => prevFiles.map(f => {
            if (f === file) {
                return { ...f, genres: selectedOptions };
            }
            return f;
        }));
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
        <>
            <React.Fragment key={`${file.path}-${index}`}>
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
                                        onChange={handleFileNameChange(file)}
                                        onBlur={handleBlur}
                                        onKeyDown={(event) => handleKeyDown(event, file, index)}
                                        className='input-style'
                                        placeholder="Song name"
                                    />
                                    {file.isNameEmpty && <div>Song name can't be empty</div>}
                                </Row>
                                <Row className='w-100'>
                                    <AudioPlayer src={file.preview} layout="horizontal" className='player-borderless' customAdditionalControls={[]} customVolumeControls={[]} showJumpControls={false} />
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
        </>

    ));

    const filesAddMore = (
        <Row className="mb-2 files-view" style={{ cursor: 'pointer', color: 'gray' }}>
            <Col className='d-flex flex-column justify-content-start'>
                <Row className='d-flex flex-nowrap'>
                    <Col xs={12} className='d-flex justify-content-center align-items-center'>
                        <i class="fa fa-plus-square px-2" aria-hidden="true" />

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

const MediaDropzone = ({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop, onGenreChange }) => (
    <Basic uploadText={uploadText} uploadTextClass={uploadTextClass} iconClass={iconClass} iconSize={iconSize} activeStyle={activeStyle} acceptStyle={acceptStyle} onDrop={onDrop} onGenreChange={onGenreChange} />
);

export default MediaDropzone;