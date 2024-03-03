import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import { Table } from 'antd';
import { Descriptions, Table } from "antd";
import "../style/Modal.css"
import { useState } from "react";

function AddStudentModal({ data, show, onClose }) {
    const columns = [
        {
            title: 'Mã lớp học',
            dataIndex: 'courseCode',
            key: 'courseCode',
        },
        {
            title: 'Tên lớp học',
            dataIndex: 'courseName',
            key: 'courseName',
        },
        {
            title: 'Giảng viên',
            dataIndex: '',
            key: '',
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

    const [tableData, setTableData] = useState([
        {
            key: 1,
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
        },
        {
            key: 2,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
        },
        {
            key: 3,
            name: 'Not Expandable',
            age: 29,
            address: 'Jiangsu No. 1 Lake Park',
            description: 'This not expandable',
        },
        {
            key: 4,
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
        },
        {
            key: 4,
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
        },
    ]);

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
                        dataSource={tableData}
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