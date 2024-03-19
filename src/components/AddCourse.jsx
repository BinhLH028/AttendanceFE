import { Button, Form, Input, InputNumber, Select, Table } from "antd";
import { useEffect, useState } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import AddStudentModal from "./AddStudentModal";
import { DataGrid } from "@mui/x-data-grid";

const { Option } = Select;

const MAX_COUNT = 5;

const AddCourse = () => {
  const axiosPrivate = useAxiosPrivate();

  const [form1] = Form.useForm();

  const [form2] = Form.useForm();

  const [teacherOptions, setTeacherOptions] = useState([]);

  const [sectionOptions, setSectionOptions] = useState([]);

  // #region table course section
  const [rowsCS, setRowsCS] = new useState([]);
  const [columnsCS, setColumnsCS] = new useState([]);

  // const setUpData = async (selectedCourse) => {
  //     setData(selectedCourse)
  //     console.log(data)

  //     await setRows(selectedCourse.map(({ userId, userCode, userName, dob, attendanceSheet }) => ({
  //         id: i++,
  //         col1: userCode,
  //         col2: userName,
  //         col3: dob,
  //         col4: attendanceSheet.lecture1,
  //         col5: attendanceSheet.lecture2,
  //         col6: attendanceSheet.lecture3,
  //         col7: attendanceSheet.lecture4,
  //         col8: attendanceSheet.lecture5,
  //         col9: attendanceSheet.lecture6,
  //         col10: attendanceSheet.lecture7,
  //         col11: attendanceSheet.lecture8,
  //         col12: attendanceSheet.lecture9,
  //         col13: attendanceSheet.lecture10,
  //         col14: attendanceSheet.lecture11,
  //         col15: attendanceSheet.lecture12,
  //         col16: attendanceSheet.lecture13,
  //         col17: attendanceSheet.lecture14,
  //         col18: attendanceSheet.lecture15,
  //     })));

  //     console.log(rows)

  //     setColumns([
  //         { field: 'col1', headerName: 'Mã SV', width: 150 },
  //         { field: 'col2', headerName: 'Họ và tên', width: 150 },
  //         { field: 'col3', headerName: 'Ngày sinh', width: 150 },
  //         { field: 'col4', headerName: 'lecture 1', width: 150, type: 'boolean', editable: true },
  //         { field: 'col5', headerName: 'lecture 2', width: 150, type: 'boolean', editable: true },
  //         { field: 'col6', headerName: 'lecture 3', width: 150, type: 'boolean', editable: true },
  //         { field: 'col7', headerName: 'lecture 4', width: 150, type: 'boolean', editable: true },
  //         { field: 'col8', headerName: 'lecture 5', width: 150, type: 'boolean', editable: true },
  //         { field: 'col9', headerName: 'lecture 6', width: 150, type: 'boolean', editable: true },
  //         { field: 'col10', headerName: 'lecture 7', width: 150, type: 'boolean', editable: true },
  //         { field: 'col11', headerName: 'lecture 8', width: 150, type: 'boolean', editable: true },
  //         { field: 'col12', headerName: 'lecture 9', width: 150, type: 'boolean', editable: true },
  //         { field: 'col13', headerName: 'lecture 10', width: 150, type: 'boolean', editable: true },
  //         { field: 'col14', headerName: 'lecture 11', width: 150, type: 'boolean', editable: true },
  //         { field: 'col15', headerName: 'lecture 12', width: 150, type: 'boolean', editable: true },
  //         { field: 'col16', headerName: 'lecture 13', width: 150, type: 'boolean', editable: true },
  //         { field: 'col17', headerName: 'lecture 14', width: 150, type: 'boolean', editable: true },
  //         { field: 'col18', headerName: 'lecture 15', width: 150, type: 'boolean', editable: true },
  //     ]);
  // }
  // #endregion

  const courseTableColumns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Mã lớp học",
      dataIndex: "courseCode",
      key: "courseCode",
    },
    {
      title: "Tên lớp học",
      dataIndex: "courseName",
      key: "courseName",
    },
    // {
    //     title: 'Năm học',
    //     dataIndex: 'year',
    //     key: 'year',
    // },
    // {
    //     title: 'Học kì',
    //     dataIndex: 'semester',
    //     key: 'semester',
    // },
    {
      title: "Action",
      render: (_, course) =>
        courseTableData.length >= 1 ? (
          <Button
            type="primary"
            shape="circle"
            className="bg-[#1677ff]"
            onClick={() => handleShowAddStudentModal(course)}
          >
            +
          </Button>
        ) : null,
    },
  ];

  const courseSectionTableColumns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Mã lớp học",
      dataIndex: "courseCode",
      key: "courseCode",
    },
    {
      title: "Tên lớp học",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Giảng viên",
      dataIndex: "teacherList",
      key: "teacherList",
    },
    // {
    //     title: 'Năm học',
    //     dataIndex: 'year',
    //     key: 'year',
    // },
    // {
    //     title: 'Học kì',
    //     dataIndex: 'semester',
    //     key: 'semester',
    // },
    {
      title: "Action",
      render: (_, course) =>
        courseSectionTableData.length >= 1 ? (
          <Button
            type="primary"
            shape="circle"
            className="bg-[#1677ff]"
            onClick={() => handleShowAddStudentModal(course)}
          >
            +
          </Button>
        ) : null,
    },
  ];

  const [courseTableData, setCourseTableData] = useState([]);

  const [courseSectionTableData, setCourseSectionTableData] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [showModal, setShowModal] = useState(false);

  let courseList = [];

  const [studentList, setStudentList] = useState({});

  const [teacherList, setTeacherList] = useState([]);

  const [courseTableLoading, setCourseTableLoading] = useState(false);

  const [courseSectionTableLoading, setCourseSectionTableLoading] =
    useState(false);

  const [courseSectiontableParams, setCourseSectionTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 3,
    },
  });

  const [coursetableParams, setCourseTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 3,
    },
  });

  const [shouldUpdate, setShouldUpdate] = useState(true);

  const [value, setValue] = useState([]);

  const [loadings, setLoadings] = useState([]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  const getCourses = async () => {
    try {
      // setLoading(true);
      const response = await axiosPrivate.get("/course/all");
      let courseList = response.data.body.map((course) => {
        return { ...course, value: course.courseId, label: course.courseCode };
      });
      setCourseTableData(courseList);
      console.log(response);
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  const getSections = async () => {
    try {
      const response = await axiosPrivate.get("/section");
      if (response) {
        setTeacherList(response.data.body);
        var listData = [];
        response.data.body.map((res) => {
          listData.push({
            label: "Học kì " + res.semester + " năm " + res.year,
            value: res.sectionId,
          });
          console.log(res);
        });
        setSectionOptions(listData);
        console.log(listData);
      }
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  const getCourseSections = async () => {
    setCourseSectionTableLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/course_section/1?page=${
          courseSectiontableParams.pagination.current - 1
        }`
      );
      if (response)
        response.data.body.content.map((res) => {
          let courseSection = {};
          const flatten = (source, prefix = "") => {
            for (const key in source) {
              if (typeof source[key] === "object" && source[key] !== null) {
                flatten(source[key], key + ".");
              } else {
                courseSection[key] = source[key];
              }
            }
          };
          flatten(res);
          if (res.teacherName.length <= 1)
            courseSection = {
              ...courseSection,
              teacherList: res.teacherName[0].userName,
            };
          else {
            res.teacherName.reduce((acc, teacher) => {
              courseSection = {
                ...courseSection,
                teacherList: acc["userName"] + ", " + teacher.userName,
              };
            });
          }
          courseList.push(courseSection);
        });
      setCourseSectionTableData(courseList);
      setCourseSectionTableParams({
        ...courseSectiontableParams,
        pagination: {
          ...courseSectiontableParams.pagination,
          total: response.data.body.totalElements,
        },
      });
      setCourseSectionTableLoading(false);
      console.log(courseList);
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  const getTeachers = async () => {
    try {
      const response = await axiosPrivate.get("/teacher/all");
      if (response) {
        setTeacherList(response.data.body);
        var listData = [];
        response.data.body.map((res) => {
          listData.push({
            label: res.username,
            value: res.userId,
          });
          console.log(res);
        });
        setTeacherOptions(listData);
      }
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  const onCourseFinish = async (values) => {
    try {
      const response = await axiosPrivate.post("/course/new", values);
      console.log(response);
      if (response.status === 200) {
        showSuccessMessage("Tạo khóa học thành công!");
      }
      form2.resetFields();
      setShouldUpdate(true);
      setLoadings([]);
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  const onSectionFinish = async (values) => {
    try {
      const response = await axiosPrivate.post("/section/new", values);
      // console.log(response);
      if (response.status === 200) {
        showSuccessMessage("Tạo học kì thành công!");
      }
      form1.resetFields();
      setShouldUpdate(true);
      setLoadings([]);
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  function isFieldsTouched() {
    return (
      form1.isFieldTouched("semester") && form1.isFieldTouched("startYear")
    );
  }

  const handleShowAddStudentModal = async (course) => {
    setSelectedCourse(course.courseId);
    setShowModal(true);

    await fetchStudentList(course.courseId);
  };

  const handleCloseModalDetail = () => {
    setShowModal(false);
  };

  // const getSections = async () => {
  //     try {
  //         const response = await axiosPrivate.get("/section");
  //         console.log(response);
  //     } catch (error) {
  //         console.log(error);
  //         showErrorMessage(error);
  //     }
  // };

  const handleCourseSectionTableChange = (pagination, filters, sorter) => {
    setCourseSectionTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== courseSectiontableParams.pagination?.pageSize) {
      setCourseSectionTableData([]);
    }
  };

  const handleCourseTableChange = (pagination, filters, sorter) => {
    setCourseSectionTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== courseSectiontableParams.pagination?.pageSize) {
      setCourseSectionTableData([]);
    }
  };

  const fetchStudentList = async (courseId) => {
    try {
      // Check if student list for this course is already cached
      if (studentList[courseId]) {
        // If cached, set the student list from cache
        return studentList[courseId];
      } else {
        // If not cached, fetch student list from server
        const response = await axiosPrivate.get(`/student`, {
          params: { courseId: courseId },
        });
        const students = response.data.body.map((student, index) => {
          return {
            ...student,
            dob: student.dob.substring(0, 10),
            no: index + 1,
          };
        });
        console.log(students);
        // Cache the student list for this course
        setStudentList({ ...studentList, [courseId]: students });

        return students;
      }
    } catch (error) {
      console.error("Error fetching student list:", error);
      return [];
    }
  };

  const handleChange = (value) => {
    setUpData();
  };

  const onCellEditCommit = (params) => {
    // params contains information about the edited cell
    console.log("Edited Cell:", params);

    // Access the entire row using params.row
    console.log("Entire Row:", params.row);

    // Store the edited cell for further use if needed
    setEditedCell(params);
  };

  useEffect(() => {
    if (shouldUpdate) {
      getCourses();
      getSections();
      // setUpData();
      getCourseSections();
      getTeachers();
      setShouldUpdate(false); // Reset shouldUpdate after fetching data
    }
  }, [shouldUpdate]);

  useEffect(() => {
    getCourseSections();
  }, [JSON.stringify(courseSectiontableParams)]);

  return (
    <>
      <div className="h-screen grid grid-cols-10 grid-rows-4 gap-4 rounded-xl mr-5">
        <div className="col-span-3 bg-gray-50 rounded-xl p-4 min-w-64">
          <Form
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 10,
            }}
            style={{
              width: "auto",
              maxWidth: 600,
              paddingRight: "2rem",
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onSectionFinish}
            autoComplete="off"
            form={form1}
          >
            <Form.Item
              label="Học kì"
              name="semester"
              rules={[
                {
                  required: true,
                  message: "Học kì không được trống!",
                },
              ]}
            >
              <Select allowClear>
                <Select.Option value="1">Học kì 1</Select.Option>
                <Select.Option value="2">Học kì 2</Select.Option>
                {/* <Select.Option value="3">Học kì phụ</Select.Option> */}
              </Select>
            </Form.Item>

            <Form.Item
              name="year"
              label="Năm học"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <InputNumber
                type="number"
                min={0}
                max={new Date().getFullYear()}
              />
              {/* <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  lineHeight: "32px",
                  textAlign: "center",
                }}
              >
                -
              </span>
              <Form.Item
                                name="endYear"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 12px)',
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: '',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item> */}
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
              shouldUpdate
            >
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !isFieldsTouched() ||
                    form1.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  }
                  className="bg-[#1677ff]"
                  loading={loadings[0]}
                  onClick={() => enterLoading(0)}
                >
                  Submit
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>

        <div className="col-span-3 row-span-3 row-start-2 rounded-xl bg-gray-50 p-4 min-w-64">
          <div
            className="md:col-span-4 rounded-xl"
            style={{
              minWidth: "250px",
            }}
          >
            <Form
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                width: "auto",
                maxWidth: 600,
                paddingRight: "2rem",
                zIndex: -10,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onCourseFinish}
              autoComplete="off"
              form={form2}
            >
              <Form.Item
                label="Mã lớp học"
                name="courseCode"
                rules={[
                  {
                    required: true,
                    message: "Mã lớp học không được trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tên lớp học"
                name="courseName"
                rules={[
                  {
                    required: true,
                    message: "Tên lớp học không được trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              {/* <Form.Item
                label="Giảng viên"
                name="Teacher"
                rules={[
                  {
                    required: true,
                    message: "chưa có Giảng viên!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select"
                  onChange={handleChange}
                  options={teacherOptions}
                />
              </Form.Item> */}

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
                shouldUpdate
              >
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !form2.isFieldsTouched(true) ||
                      form2
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length > 0
                    }
                    className="bg-[#1677ff]"
                    loading={loadings[1]}
                    onClick={() => enterLoading(1)}
                  >
                    Submit
                  </Button>
                )}
              </Form.Item>
            </Form>
            <p>Dach sách lớp môn học</p>

            <Table
              columns={courseTableColumns}
              dataSource={courseTableData}
              // pagination={coursetableParams.pagination}
              pagination={{ pageSize: 5 }}
              loading={courseTableLoading}
              // onChange={handleCourseTableChange}
              className=""
            />
          </div>
        </div>

        <div className="col-span-7 row-span-full col-start-4 bg-gray-50 rounded-xl ">
          <Select
            allowClear
            style={{
              width: "20%",
              margin: "10px",
            }}
            placeholder="Chọn học kỳ"
            onChange={handleChange}
            options={sectionOptions}
          />

          <Table
            columns={courseSectionTableColumns}
            dataSource={courseSectionTableData}
            pagination={courseSectiontableParams.pagination}
            loading={courseSectionTableLoading}
            onChange={handleCourseSectionTableChange}
            rowKey={(record) => record.id}
          />

          {/* <DataGrid
                        rows={rowsCS}
                        columns={columnsCS}
                        pageSizeOptions={[]}
                        onCellEditCommit={onCellEditCommit} /> */}
        </div>
      </div>

      <AddTeacherModal
        studentList={teacherList}
        show={showModal}
        onClose={handleCloseModalDetail}
        selectedCourse={selectedCourse}
      />

      {/* <AddTeacherModal
        studentList={studentList}
        show={showModal}
        onClose={handleCloseModalDetail}
        selectedCourse={selectedCourse}
      /> */}
    </>
  );
};

export default AddCourse;
