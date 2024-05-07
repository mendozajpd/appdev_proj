import React, { useEffect, useState } from "react";
import { Container, Image } from 'react-bootstrap';
import { useTable } from 'react-table';
import axios from 'axios';
import BACKEND_URL from '../../config';

export function AlbumsTable() {
    const [albums, setAlbums] = useState([]);
    const token = localStorage.getItem("jwt_token");

    const fetchUsers = async () => {
        try {
            axios.get(`${BACKEND_URL}/api/albums`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    setAlbums(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } catch (error) {
            console.error('Failed to fetch artist albums:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const data = React.useMemo(() => albums, [albums]);

    const columns = React.useMemo(
        () => [
            {
                Header: "No.",
                accessor: (row, index) => index + 1,
            },
            {
                Header: "Album Cover",
                accessor: 'cover_photo_hash',
                Cell: ({ value }) => <Image src={`${BACKEND_URL}/storage/album_images/${value}`} alt="Album Cover" style={{ width: 50, height: 50 }} />,
            },
            {
                Header: "Album",
                accessor: 'album_name',
            },
            {
                Header: "Description",
                accessor: 'album_description',
            },
            {
                Header: "Date",
                accessor: 'created_at',
                Cell: ({ row: { original } }) => {
                    const date = new Date(original.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    const status = original.is_published ? 'Published' : 'Draft';
                    return (
                        <div>
                            {date}
                            <div className="text-gray">
                                {status}
                            </div>
                        </div>
                    );
                },
            },
            {
                Header: "Release Date",
                accessor: 'release_date',
                Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
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
        <Container className='custom-table' fluid>
            <table {...getTableProps()} style={{ width: '100%', textAlign: 'left' }}>
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
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Container>
    );
}