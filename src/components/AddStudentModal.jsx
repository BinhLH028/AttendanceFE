import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import { Descriptions, Form, Popconfirm, Select, Table, message, Button } from "antd";
import "../style/Modal.css";
import { useEffect, useRef, useState } from "react";
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import { axiosPrivate } from "../api/http-common";

function AddStudentModal({
    currentCS,
    studentList,
    show,
    onClose,
    selectedCourse,
    courseSectionStudentList,
    setCourseSectionStudentList,
    getCourseSections,
    setShowModal
}) {
    const [selectedValues, setSelectedValues] = useState([]);

    const [form] = Form.useForm();

    const columns = [
        {
            title: "No.",
            dataIndex: "no",
            key: "no",
        },
        {
            title: "Msv",
            dataIndex: "userCode",
            key: "userCode",
        },
        {
            title: "Tên sinh vien",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Ngày sinh",
            dataIndex: "dob",
            key: "dob",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Khoá",
            dataIndex: "schoolYear",
            key: "schoolYear",
        }
    ];

    const [disableSubmitButton, setDisableSubmitButton] = useState(true);

    const [loading, setLoading] = useState(false);

    const [selectValue, setSelectValue] = useState([]);

    let defaultStudentList = [];

    const handleSelectStudentChange = (value) => {
        setSelectValue(value);
        setDisableSubmitButton(false);
    };

    const tableFooter = () => {
        return (
            <Form
                id='selectStudentForm'
                form={form}
                onFinish={handleSubmitButton}
            >
                <Form.Item
                    label="Danh sách sinh viên :"
                    name="studentList"
                    rules={[
                        {
                            required: true,
                            message: 'Please input!',
                        },
                    ]}
                    initialValue={defaultStudentList}
                >
                    <Select
                        required
                        optionFilterProp="label"
                        showSearch
                        mode="multiple"
                        allowClear
                        style={{ width: '100%', borderColor: selectedValues.length === 0 ? 'red' : undefined }}
                        placeholder="Please select"
                        options={studentList.map((student) => ({
                            label: student.userName,
                            value: student.userId,
                        }))}
                        onChange={handleSelectStudentChange}
                    />
                </Form.Item>
            </Form>
        );
    };

    const handleSubmitButton = async (value) => {
        setLoading(true);
        let submitValues = { studentIds: value.studentList, courseSectionId: selectedCourse };
        try {
            const response = await axiosPrivate.post("/student_enrolled/update", submitValues);
            if (response.status === 200) {
                showSuccessMessage("Thêm sinh viên thành công!");
                setCourseSectionStudentList(value.studentList);
            }
            onClose();
            setLoading(false);
            getCourseSections(currentCS);
        } catch (error) {
            console.log(error);
            showErrorMessage(error);
        }
    }

    useEffect(() => {
        if (selectedCourse && Array.isArray(courseSectionStudentList[selectedCourse])) {
            form.setFieldValue('studentList', courseSectionStudentList[selectedCourse]?.map((student) => student.userId));
            setDisableSubmitButton(true);
        }
    }, [selectedCourse, courseSectionStudentList])

    const handleCloseModal = () => {
        // form.resetFields();
        form.setFieldValue('studentList', courseSectionStudentList[selectedCourse]?.map((student) => student.userId));
        setShowModal(false);
        setDisableSubmitButton(true);
        // onClose();
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleCloseModal}
                dialogClassName="custom-modal"
                centered
                size="xl"
                // fullscreen="sm-down"
                backdrop="static"
            >
                <Modal.Header closeButton={handleCloseModal}>
                    <Modal.Title>Course detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!courseSectionStudentList[selectedCourse] && Array.isArray(courseSectionStudentList[selectedCourse]) ? (
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
                    <Button form="selectStudentForm" key='submit' htmlType="submit" variant="primary" loading={loading} disabled={disableSubmitButton}>
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddStudentModal;
