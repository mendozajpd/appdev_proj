import '../../css/dataTables.css'
import '../../css/index.css';
import React, { Component, useEffect, useRef, useState } from "react";
import { Container, Image, Stack, Dropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import BACKEND_URL from '../../config';
import axios from 'axios';


export function SongsTable() {

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
            columns: [
                {
                    title: "No.",
                    data: null,
                    render: (data, type, row, meta) => meta.row + 1
                },
                // {
                //     title: "Album Cover",
                //     data: 'cover_photo_hash',
                //     render: data => `<Image src="${BACKEND_URL}/storage/album_images/${data}" alt="Album Cover" style="width: 50px; height: 50px;">`
                // },
                { data: 'display_name', title: "Title" }, // Assuming 'title' is the property for the song title
                // { data: 'album_name', title: "Album" },
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
                    title: "Options",
                    data: null,
                    render: (data, type, row) => `<div id="dropdown-${row.id}"></div>`
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