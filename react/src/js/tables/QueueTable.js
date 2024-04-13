import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTable } from 'react-table';
import { Dropdown, Image, Container, Row } from "react-bootstrap";
import axios from 'axios';
import BACKEND_URL from '../../config';

// CONTEXT
import PlayerContext from "../context/PlayerContext";


export function QueueTable() {


    const token = localStorage.getItem("jwt_token");
    const navigate = useNavigate();
    const { id } = useParams();

    const { currentQueue, queue, setQueue, setCurrentQueue } = useContext(PlayerContext);


    useEffect(() => {

    }, [id]);

    const data = React.useMemo(() => queue, [queue, currentQueue]);

    const columns = React.useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, i) => i - currentQueue + 1,
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
                            <Dropdown.Item href="/profile">
                                <i className="fa fa-plus mx-2" />
                                Add to playlist
                            </Dropdown.Item>
                            {/* <Dropdown.Item onClick={() => removeSongFromPlaylist(id, value)}>
                                <i className="fa fa-trash mx-2" />
                                Remove from this playlist
                            </Dropdown.Item> */}
                            <Dropdown.Item href="/settings">
                                <i className="fa fa-indent mx-2" />
                                Add to queue
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ),
            },
        ],
        [currentQueue, queue]
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
                        <tr>
                            <th colSpan={5}>Now Playing</th>
                        </tr>
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.slice(currentQueue, currentQueue + 1).map((row, index) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
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
                    <thead>
                        <tr>
                            <th colSpan={5}>Next Up</th>
                        </tr>
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.slice(currentQueue + 1).map((row, index) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} onClick={() => {
                                    setCurrentQueue(index + currentQueue + 1);
                                }}>
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