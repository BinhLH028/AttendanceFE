import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import { Table } from 'antd';
import { Descriptions, Popconfirm, Select, Table, message } from "antd";
import "../style/Modal.css";
import { useEffect, useState } from "react";

function AddTeacherModal({
  teacherList,
  show,
  onClose,
  selectedCourse,
  courseSectionTeacherList,
  setCourseSectionTeacherList,
}) {
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Tên giảng viên",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
    },
  ];

  const handleSelectTeacherChange = (courseId) => {
    const teachers = response.data.map((teacher, index) => {
      return {
        ...teacher,
        dob: teacher.dob.substring(0, 10),
        no: index + 1,
      };
    });
    setCourseSectionTeacherList({
      ...courseSectionTeacherList[selectedCourse],
      [courseId]: teachers,
    });
  };

  const tableFooter = () => {
    return (
      <Select
        optionFilterProp="label"
        showSearch
        onSearch={onSearch}
        mode="multiple"
        allowClear
        style={{
          width: "100%",
        }}
        placeholder="Please select"
        defaultValue={courseSectionTeacherList[selectedCourse]?.map(
          (teacher) => teacher.userId
        )}
        options={teacherList.map((teacher) => ({
          label: teacher.username,
          value: teacher.userId,
        }))}
        onChange={handleSelectTeacherChange}
      />
    );
  };

  const handleAddTeacher = () => {
    console.log("add");
  };

  const confirm = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

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
          {!courseSectionTeacherList[selectedCourse] ? (
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
          <Popconfirm
            title="Modify teacher list"
            description="Are you sure to modify teacher list?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button variant="primary" onClick={handleAddTeacher}>
              Submit
            </Button>
          </Popconfirm>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTeacherModal;
