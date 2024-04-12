import '../../css/dataTables.css'
import '../../css/index.css';
import React, { Component, useEffect, useRef, useState } from "react";
import { Container, Image, Stack, Dropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import BACKEND_URL from '../../config';
import axios from 'axios';


export function PlaylistSongsTable() {

    const [songs, setSongs] = useState([]);
    const token = localStorage.getItem("jwt_token");

    const fetchUsers = async () => {
        try {
            axios.get(`${BACKEND_URL}/api/songs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    console.log(response.data);
                    setSongs(response.data);
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
        if (!songs) {
            return;
        }

        //console.log(tableRef.current)
        const table = $(tableRef.current).DataTable({
            data: songs,
            select: true,
            paging: false,
            info: false,
            columns: [
                {
                    title: "No.",
                    data: null,
                    render: (data, type, row, meta) => meta.row + 1
                },
                {
                    title: "Title",
                    sortable: false,
                    data: null,
                    render: (data, type, row) => {
                        if (row.album && row.album.cover_photo_hash) {
                            return `<img src="${BACKEND_URL}/storage/album_images/${row.album.cover_photo_hash}" alt="Album Cover" style="width: 50px; height: 50px;">`
                        } else {
                            return 'No cover';
                        }
                    }
                },
                { data: 'display_name', title: "" }, // Assuming 'title' is the property for the song title
                {
                    title: "Album",
                    data: null,
                    render: (data, type, row) => {
                        return `${row.album.album_name}`
                    }
                },
                {
                    title: "Date",
                    data: null,
                    render: (data, type, row) => {
                        const date = new Date(row.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        return `<Stack gap={2}><div>${date}</div></Stack>`;
                    }
                },
                // { data: 'duration', title: "Duration" }, // Assuming 'duration' is the property for the song duration
                {
                    title: "",
                    data: null,
                    render: (data, type, row) =>
                        `
                            <div class="dropdown">
                                <button class="dropbtn">Dropdown</button>
                                <div class="dropdown-content">
                                    <a href="#">Link 1</a>
                                    <a href="#">Link 2</a>
                                    <a href="#">Link 3</a>
                                </div>
                            </div>
                        `
                }
            ],
            destroy: true,
        });

        return function () {
            table.destroy()
        }
    }, [songs]);

    return (
        <Container className='custom-table' fluid>
            <div>
                <table className='display' width="100%" ref={tableRef} />
            </div>
        </Container>)
}