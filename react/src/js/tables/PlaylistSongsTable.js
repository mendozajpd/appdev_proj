import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTable } from 'react-table';
import { Dropdown, Image, Container, Row } from "react-bootstrap";
import axios from 'axios';
import BACKEND_URL from '../../config';

// CONTEXT
import PlayerContext from "../context/PlayerContext";
import PlaylistUpdateContext from "../context/PlaylistUpdateContext";
import PlaylistSongsContext from "../context/PlaylistSongsContext";


export function PlaylistSongsTable() {
    const { songs, setSongs } = useContext(PlaylistSongsContext);
    const token = localStorage.getItem("jwt_token");

    const { id } = useParams();

    const navigate = useNavigate();

    // QUEUE
    const { setQueue, currentQueue, setCurrentQueue, currentPlaylist, setCurrentPlaylist } = useContext(PlayerContext);
    const { playlistUpdate, setPlaylistUpdate } = useContext(PlaylistUpdateContext);

    // SELECTION
    const [selected, setSelected] = useState(null);

    const fetchSongs = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/playlist/${id}/songs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSongs(response.data.songs);
            // console.log('Songs', response.data);
        } catch (error) {
            console.error('Failed to fetch songs:', error);
        }
    };

    const removeSongFromPlaylist = async (playlist_id, song_id) => {
        try {
            console.log('Removing song from playlist', playlist_id, song_id)
            await axios.delete(`${BACKEND_URL}/api/playlist/${playlist_id}/${song_id}/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Song removed from playlist', playlist_id, song_id);
            setPlaylistUpdate(true);
        } catch (error) {
            console.error('Failed to remove song:', error);
        }

    }

    useEffect(() => {
        if (currentPlaylist === id) {
            setSelected(currentQueue);
        } else {
            setSelected(null);
        }

        fetchSongs();
        if (playlistUpdate) {
            setPlaylistUpdate(false);
        }
    }, [id, playlistUpdate, currentQueue, currentPlaylist]);

    const data = React.useMemo(() => songs, [songs]);

    const columns = React.useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, i) => i + 1,
                Cell: ({ value }) =>
                    <>
                        <div className="mx-3">
                            {value}
                        </div>
                    </>
            },
            {
                Header: "Title",
                accessor: 'display_name',
                Cell: ({ row }) => (
                    <div className="p-2 d-flex align-items-center">
                        <Image src={`${BACKEND_URL}/storage/album_images/${row.original.album.cover_photo_hash}`} alt="Album Cover" style={{ width: '50px', height: '50px' }} rounded />
                        <div className="mx-3">
                            <div className="playlist-song-title text-truncate">
                                {row.original.display_name}
                            </div>
                            <div className="playlist-song-author d-inline" onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/artist/${row.original.user_id}`);
                            }}>
                                {row.original.user.name}
                            </div>
                        </div>
                    </div >
                ),
            },
            {
                Header: "Album",
                accessor: 'album.album_name',
                Cell: ({ value }) => {
                    return (
                        <div className="album-title-row text-truncate d-inline">
                            {value}
                        </div>
                    )
                }

            },
            {
                Header: "Date Added",
                accessor: 'pivot.created_at',
                Cell: ({ value }) => {
                    const date = new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    return (
                        <div className="date-added-row text-truncate">
                            {date}
                        </div>
                    );
                }
            },
            {
                Header: "Duration",
                accessor: 'updated_at',
                Cell: ({ value }) => {
                    const date = new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    return (
                        <div className="duration-row text-truncate">
                            n/a
                        </div>
                    );
                }
            },
            {
                Header: "",
                accessor: 'id',
                maxWidth: 10,
                Cell: ({ value }) => (
                    <Dropdown className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                        <Dropdown.Toggle id="dropdown-basic">
                            <i className="fa fa-ellipsis-h ellipsis" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item href="/profile" disabled>
                                <i className="fa fa-plus mx-2" />
                                Add to playlist
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => removeSongFromPlaylist(id, value)}>
                                <i className="fa fa-trash mx-2" />
                                Remove from this playlist
                            </Dropdown.Item>
                            <Dropdown.Item href="/settings" disabled>
                                <i className="fa fa-indent mx-2" />
                                Add to queue
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <Container fluid className="w-100 playlist-table">
            <div>
                <table {...getTableProps()} className="w-100">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <tr
                                    onClick={() => {
                                        setQueue(songs);
                                        setCurrentQueue(index);
                                        setSelected(index); // Set the selected state
                                        setCurrentPlaylist(id);
                                    }}
                                    {...row.getRowProps()}
                                    style={{
                                        background: index === selected ? '#ffffff10' : '#00000001',
                                        color: index === selected ? 'white' : '#a7a7a7',
                                    }}
                                >
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}
                                            className={cell.column.id === 'display_name' ? 'title-column' : cell.column.id === 'album.album_name' ? 'album-column' : cell.column.id === 'id' ? 'ellipsis-column' : ''
                                            }>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Container>
    );
}