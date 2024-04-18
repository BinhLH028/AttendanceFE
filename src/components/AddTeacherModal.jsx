import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import { Form, Select, Table, Button } from "antd";
import "../style/Modal.css";
import { useEffect, useRef, useState } from "react";
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import { axiosPrivate } from "../api/http-common";
import DebounceSelect from "./DebounceSelect"

function AddTeacherModal({
  currentCS,
  teacherList,
  show,
  onClose,
  selectedCourse,
  courseSectionTeacherList,
  setCourseSectionTeacherList,
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
      title: "Tên giảng viên",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Khoa",
      dataIndex: "department",
      key: "department",
    },
  ];

  const [disableSubmitButton, setDisableSubmitButton] = useState(true);

  const [loading, setLoading] = useState(false);

  const [selectValue, setSelectValue] = useState([]);


  let defaultTeacherList = [];

  const handleSelectTeacherChange = (value) => {
    setSelectValue(value);
    setDisableSubmitButton(false);
  };

  async function fetchTeacherByFilter(code) {

    const response = await axiosPrivate.post(`/teacher/name?n=${code}`);
    let teacherList = response.data.body.map((teacher, index) => {
      return { index: index + 1, ...teacher,  label: teacher.userName, value: teacher.userId };
    });
    console.log(teacherList);
    return teacherList;
  }

  const tableFooter = () => {
    return (
      <Form
        id='selectTeacherForm'
        form={form}
        onFinish={handleSubmitButton}
      >
        <Form.Item
          label="Danh sach giang vien :"
          name="teacherList"
          rules={[
            {
              required: true,
              message: 'Please input!',
            },
          ]}
          initialValue={defaultTeacherList}
        >
          <Select
            required
            optionFilterProp="label"
            showSearch
            mode="multiple"
            allowClear
            style={{ width: '100%', borderColor: selectedValues.length === 0 ? 'red' : undefined }}
            placeholder="Please select"
            options={teacherList.map((teacher) => ({
              label: teacher.userName,
              value: teacher.userId,
            }))}
            onChange={handleSelectTeacherChange}
          />
          {/* <DebounceSelect
            required
            mode="multiple"
            showSearch
            optionFilterProp="label"
            style={{ width: '100%', borderColor: selectedValues.length === 0 ? 'red' : undefined }}
            placeholder="Select users"
            fetchOptions={fetchTeacherByFilter}
            onChange={handleSelectTeacherChange}
          /> */}
        </Form.Item>
      </Form>
    );
  };

  const handleSubmitButton = async (value) => {
    setLoading(true);
    let submitValues = { teacherIds: value.teacherList, courseSectionId: selectedCourse };
    // console.log(value, submitValues);
    try {
      let response;
      if (courseSectionTeacherList[selectedCourse].length === 0)
        response = await axiosPrivate.post("/teacher_teach/new", submitValues);
      else
        response = await axiosPrivate.post("/teacher_teach/update", submitValues);
      if (response.status === 200) {
        showSuccessMessage("Them giang vien thành công!");
        setCourseSectionTeacherList(value.teacherList);
      }
      onClose();
      setLoading(false);
      getCourseSections(currentCS);
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedCourse && Array.isArray(courseSectionTeacherList[selectedCourse])) {
      // form.resetFields();
      form.setFieldValue('teacherList', courseSectionTeacherList[selectedCourse]?.map((teacher) => teacher.userId));
      setDisableSubmitButton(true);
    }
  }, [selectedCourse, courseSectionTeacherList])

  const handleCloseModal = () => {
    // form.resetFields();
    form.setFieldValue('teacherList', courseSectionTeacherList[selectedCourse]?.map((teacher) => teacher.userId));
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
          {!courseSectionTeacherList[selectedCourse] && Array.isArray(courseSectionTeacherList[selectedCourse]) ? (
            <Table loading={true} />
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={
                  courseSectionTeacherList[selectedCourse] !== null &&
                  courseSectionTeacherList[selectedCourse]
                }
                footer={tableFooter}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button form="selectTeacherForm" key='submit' htmlType="submit" variant="primary" loading={loading} disabled={disableSubmitButton}>
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

export default AddTeacherModal;
