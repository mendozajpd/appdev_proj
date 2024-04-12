import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTable } from 'react-table';
import { Dropdown, Image, Container, Row } from "react-bootstrap";
import axios from 'axios';
import BACKEND_URL from '../../config';

import PlayerContext from "../context/PlayerContext";


export function PlaylistSongsTable() {
    const [songs, setSongs] = useState([]);
    const token = localStorage.getItem("jwt_token");

    const { id } = useParams();

    const navigate = useNavigate();

    const { setSongID } = useContext(PlayerContext);

    const fetchSongs = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/playlist/${id}/songs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSongs(response.data);
            console.log('Songs', response.data);
        } catch (error) {
            console.error('Failed to fetch songs:', error);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, [id]);

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
                            <div className="playlist-song-author" onClick={(e) => {
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
                        <div className="album-title-row text-truncate">
                            {value}
                        </div>
                    )
                }

            },
            {
                Header: "Date Added",
                accessor: 'created_at',
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
                            {date}
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
                            <Dropdown.Item href="/profile">Add to playlist</Dropdown.Item>
                            <Dropdown.Item href="/settings">Remove from this playlist</Dropdown.Item>
                            <Dropdown.Item href="/settings">Add to queue</Dropdown.Item>
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
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr onClick={() => {
                                    setSongID(row.original.id);
                                }} {...row.getRowProps()}>
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