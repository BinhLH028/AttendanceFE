import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import { Table } from 'antd';
import { Descriptions, Table } from "antd";
import "../style/Modal.css"
import { useState } from "react";

function AddStudentModal({ studentList, show, onClose, selectedCourse }) {
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'Tên sinh viên',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Năm học',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'Học kì',
            dataIndex: 'semester',
            key: 'semester',
        },
    ];

    const tableFooter = () => {
        return (
            <Button></Button>
        )
    }

    return (
        <>
            <Modal
                show={show}
                onHide={onClose}
                dialogClassName="custom-modal"
                centered
                size="xl"
                // fullscreen="sm-down"
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Course detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table
                        columns={columns}
                        dataSource={studentList[selectedCourse]}
                        footer={() => 'Footer'} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddStudentModal;