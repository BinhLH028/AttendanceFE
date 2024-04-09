import "bootstrap/dist/css/bootstrap.min.css";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import { Table } from 'antd';
import { Descriptions, Form, Popconfirm, Select, Table, message, Button } from "antd";
import "../style/Modal.css";
import { useEffect, useRef, useState } from "react";
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import { axiosPrivate } from "../api/http-common";

function AddStudentModal({
    studentList,
    show,
    onClose,
    selectedCourse,
    courseSectionStudentList,
    setCourseSectionStudentList,
    getCourseSections
}) {
    const [selectedValues, setSelectedValues] = useState([]);

    const columns = [
        {
            title: "No.",
            dataIndex: "no",
            key: "no",
        },
        {
            title: "Tên sinh vien",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Ngày sinh",
            dataIndex: "dob",
            key: "dob",
        },
    ];

    const [disableSubmitButton, setDisableSubmitButton] = useState(true);

    const [loading, setLoading] = useState(false);

    const [selectValue, setSelectValue] = useState([]);

    const handleSelectStudentChange = (value) => {
        console.log('selected' + value);
        setSelectValue(value);
        setDisableSubmitButton(false);
    };

    const tableFooter = () => {
        return (
            <Select
                value={selectValue}
                required
                optionFilterProp="label"
                showSearch
                mode="multiple"
                allowClear
                style={{ width: '100%', borderColor: selectedValues.length === 0 ? 'red' : undefined }}
                placeholder="Please select"
                options={studentList.map((student) => ({
                    label: student.username,
                    value: student.userId,
                }))}
                onChange={handleSelectStudentChange}
            />
        );
    };

    const handleSubmitButton = async () => {
        setLoading(true);
        let submitValues = { studentIds: [...selectValue], courseSectionId: selectedCourse };
        try {
            const response = await axiosPrivate.post("/student_enrolled/update", submitValues);
            if (response.status === 200) {
                showSuccessMessage("Thêm sinh viên thành công!");
                setCourseSectionStudentList(selectValue);
            }
            onClose();
            setLoading(false);
            getCourseSections();
        } catch (error) {
            console.log(error);
            showErrorMessage(error);
        }
    }

    useEffect(() => {
        if (selectedCourse) {
            setSelectValue(courseSectionStudentList[selectedCourse]?.map((student) => student.userId));
            setDisableSubmitButton(true);
        }
    }, [selectedCourse])

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
                    {!courseSectionStudentList[selectedCourse] ? (
                        <Table loading={true} />
                    ) : (
                        <>
                            <Table
                                columns={columns}
                                dataSource={
                                    courseSectionStudentList[selectedCourse] !== null &&
                                    courseSectionStudentList[selectedCourse]
                                }
                                footer={tableFooter}
                            />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" loading={loading} onClick={handleSubmitButton} disabled={disableSubmitButton}>
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddStudentModal;
