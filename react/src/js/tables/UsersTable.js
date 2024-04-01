import '../../css/dataTables.css'
import '../../css/index.css';
import React, { Component, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import BACKEND_URL from '../../config';
import axios from 'axios';


export function UsersTable() {

    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const $ = require('jquery')
    $.DataTable = require('datatables.net')
    const tableRef = useRef();

    useEffect(() => {
        fetchUsers();
    }, []);


    useEffect(() => {
        if (!users) {
            return;
        }

        // //console.log(tableRef.current)
        const $table = $(tableRef.current);
        const table = $(tableRef.current).
            DataTable({
                data: users,
                columns: [
                    { data: 'id', title: "ID" },
                    { data: 'name', title: "Username" },
                    { data: 'email', title: "Email" },
                    { data: 'role', title: "Role" },
                    {
                        title: "Status",
                        data: null,
                        render: function (data, type, row) {
                            if (row.is_deactivated) {
                                return '<span style="color: red;">Deactivated</span>';
                            } else {
                                return row.email_verified_at
                                    ? '<span style="color: green;">Normal</span>'
                                    : '<span style="color: orange;">Pending Verification</span>';
                            }
                        }
                    },
                    {
                        title: "Action",
                        data: null,
                        defaultContent: "<button class='view-button'>View</button> <button class='edit-button'>Edit</button> <button class='deactivate-button'>Deactivate</button> <button class='delete-button'>Delete</button>",
                        orderable: false
                    }
                ],
                destroy: true,
            });

        $table.on('click', 'button.view-button', function () {
            const data = table.row($(this).parents('tr')).data();
        });

        $table.on('click', 'button.edit-button', function () {
            const data = table.row($(this).parents('tr')).data();
            // //console.log(data);
        });

        $table.on('click', 'button.deactivate-button', function () {
            const data = table.row($(this).parents('tr')).data();
            // //console.log(data);
        });

        $table.on('click', 'button.delete-button', function () {
            const data = table.row($(this).parents('tr')).data();
            //console.log(data);
        });

        return function () {
            //console.log("Table destroyed")
            table.destroy()
        }
    }, [users]);

    return (<Container className='table-background' fluid>
        <div className='table'>
            <table className='display' width="100%" ref={tableRef}>
            </table>
        </div>
    </Container>)
}