import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { Button, Image, Container, Row, Form } from "react-bootstrap";
import axios from 'axios';
import BACKEND_URL from '../../config';


// CONTEXT
import PlayerContext from "../context/PlayerContext";
import PlaylistUpdateContext from "../context/PlaylistUpdateContext";
import PlaylistSongsContext from "../context/PlaylistSongsContext";


export function AddSongsToPlaylistTable() {
    const [artistSongs, setArtistSongs] = useState([]);
    const {songs, setSongs} = useContext(PlaylistSongsContext);
    const token = localStorage.getItem("jwt_token");

    const { id } = useParams();

    const navigate = useNavigate();

    const { setSongID } = useContext(PlayerContext);
    const { playlistUpdate, setPlaylistUpdate } = useContext(PlaylistUpdateContext);
    const [songAdded, setSongAdded] = useState(false);

    const fetchSongs = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/songs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const allSongs = response.data;
            const filteredSongs = allSongs.filter(song => !songs.find(ps => ps.id === song.id));
            setArtistSongs(filteredSongs);
            // console.log('Songs', filteredSongs);
        } catch (error) {
            console.error('Failed to fetch songs:', error);
        }
    };

    const addSongsToPlaylist = async (playlist_id, song_id) => {
        try {
            await axios.post(`${BACKEND_URL}/api/add/${playlist_id}/${song_id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Song added to playlist', playlist_id, song_id);
            setPlaylistUpdate(true);
            setSongAdded(true);
        } catch (error) {
            console.error('Failed to add songs:', error);
        }
    }

    useEffect(() => {
        console.log('all songs', artistSongs);
        fetchSongs();
        if (songAdded) {
            setSongAdded(false);
        }
    }, [id, playlistUpdate]);

    const data = React.useMemo(() => artistSongs, [artistSongs]);

    const columns = React.useMemo(
        () => [
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
                        <div className="mx-5 text-truncate">
                            <div className="album-title-row d-inline" onClick={(e) => {
                                e.stopPropagation();
                                console.log('navigate to album', value);
                            }}>
                                {value}
                            </div>
                        </div>
                    )
                }
            },
            {
                Header: "",
                accessor: 'id',
                maxWidth: 10,
                Cell: ({ value }) => (
                    <div className="mx-2">
                        <Button variant="outline-danger" onClick={(e) => { e.stopPropagation(); addSongsToPlaylist(id, value) }}>
                            Add
                        </Button>
                    </div>
                ),
            },
        ],
        [artistSongs, songs]
    );

    function globalFilterFn(rows, columnIds, filterValue) {
        return rows.filter(row => {
            const displayName = row.values['display_name'];
            const albumName = row.values['album.album_name'];
            const songID = row.values['id'];

            return ((displayName ? displayName.toLowerCase().includes(filterValue.toLowerCase()) : false)
                || (albumName ? albumName.toLowerCase().includes(filterValue.toLowerCase()) : false))
                ;
        });
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page, // Use 'page' instead of 'rows'
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        setGlobalFilter,
        state: { globalFilter },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 },
            globalFilter: globalFilterFn, // Use the custom filter function
        },
        useGlobalFilter,
        usePagination
    );

    return (
        <Container fluid className="playlist-table w-100 overflow-auto">
            <div>
                <table {...getTableProps()} className="w-100">
                    <thead>
                        <tr>
                            <th colSpan={3}>
                                <div className="d-flex w-100 justify-content-end">
                                    <div className="d-flex align-content-center flex-wrap">
                                        <i className="fa fa-search mx-2 playlist-search-icon" />
                                    </div>
                                    <Form>
                                        <Form.Group>
                                            <Form.Control type="text"
                                                value={globalFilter || ''}
                                                onChange={e => setGlobalFilter(e.target.value)}
                                                placeholder={`Search...`} >
                                            </Form.Control>
                                        </Form.Group>
                                    </Form>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => { // Use 'page' instead of 'rows'
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
            <div className="d-flex justify-content-between">
                <div>

                    <Button variant="secondary" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </Button>
                    <Button variant="secondary" onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </Button>
                </div>
                <span className="d-flex align-items-center mx-3">
                    Page
                    <strong className="mx-1">
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
            </div>
        </Container>
    );
}