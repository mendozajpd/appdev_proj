import '../css/dataTables.css'
import '../css/index.css';
import React, { Component, useEffect, useRef } from "react";
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';


export function Tbl(props) {
    const $ = require('jquery')
    $.DataTable = require('datatables.net')
    const tableRef = useRef();

    useEffect(() => {
        if (!props.data) {
            return;
        }

        console.log(tableRef.current)
        const $table = $(tableRef.current);
        const table = $(tableRef.current).
            DataTable({
                data: props.data,
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
                        defaultContent: "<button class='alert-button'>Click!</button>",
                        orderable: false
                    }
                ],
                rowCallback: function (row, data, index) {
                    $(row).addClass('clickable-row').on('click', function () {
                        console.log('Row clicked:', data);
                    });
                },
                destroy: true,
            });

        $table.on('click', 'button.alert-button', function () {
            // alert('Hello, World');
            console.log('Hello, World');
        });
        
        return function () {
            console.log("Table destroyed")
            table.destroy()
        }
    }, [props.data]);

    return (<Container className='table-background' fluid>
        <div className='table'>
            <table className='display' width="100%" ref={tableRef}>
            </table>
        </div>
    </Container>)
}