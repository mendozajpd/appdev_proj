import '../../css/dataTables.css'
import '../../css/index.css';
import React, { Component, useEffect, useRef, useState } from "react";
import { Container, Image, Stack } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import BACKEND_URL from '../../config';
import axios from 'axios';


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
                    //console.log(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } catch (error) {
            console.error('Failed to fetch artist albums:', error);
        }
    };

    const $ = require('jquery')
    $.DataTable = require('datatables.net')
    const tableRef = useRef();

    useEffect(() => {
        fetchUsers();
    }, []);


    useEffect(() => {
        if (!albums) {
            return;
        }

        //console.log(tableRef.current)
        const table = $(tableRef.current).
            DataTable({
                data: albums,
                slect: true,
                columns: [
                    {
                        title: "No.",
                        data: null,
                        render: (data, type, row, meta) => meta.row + 1
                    },
                    {
                        title: "Album Cover",
                        data: 'cover_photo_hash',
                        render: data => `<Image src="${BACKEND_URL}/storage/album_images/${data}" alt="Album Cover" style="width: 50px; height: 50px;">`
                    },
                    { data: 'album_name', title: "Album" },
                    { data: 'album_description', title: "Description" },
                    {
                        title: "Date",
                        data: null,
                        render: (data, type, row) => {
                            const status = row.is_published ? 'Published' : 'Draft';
                            const date = new Date(row.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                            return `<Stack gap={2}><div>${date}</div><div style="color: gray;">${status}</div></Stack>`;
                        }
                    },
                    {
                        data: 'release_date',
                        title: "Release Date",
                        render: data => data ? new Date(data).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'
                    }
                ],
                destroy: true,
            });

        return function () {
            //console.log("Table destroyed")
            table.destroy()
        }
    }, [albums]);

    return (
        <Container className='custom-table' fluid>
            <div>
                <table className='display' width="100%" ref={tableRef} />
            </div>
        </Container>)
}