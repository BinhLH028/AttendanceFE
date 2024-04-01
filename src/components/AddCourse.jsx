import { Button, Form, Input, InputNumber, Select, Table, message, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import AddTeacherModal from "./AddTeacherModal";

const MAX_COUNT = 5;

const AddCourse = () => {
  const axiosPrivate = useAxiosPrivate();

  const [form1] = Form.useForm();

  const [form2] = Form.useForm();

  const [teacherOptions, setTeacherOptions] = useState([]);

  const [sectionOptions, setSectionOptions] = useState([]);

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
    {
      title: "Action",
      render: (_, course) =>
        courseTableData.length >= 1 ? (
          <Button
            type="primary"
            shape="circle"
            className="bg-[#1677ff]"
            onClick={() => handleShowAddTeacherModal(course)}
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
    {
      title: "Action",
      render: (_, course) =>
        courseSectionTableData.length >= 1 ? (
          <Button
            type="primary"
            shape="circle"
            className="bg-[#1677ff]"
            onClick={() => handleShowAddTeacherModal(course)}
          >
            +
          </Button>
        ) : null,
    },
  ];

  const [courseTableData, setCourseTableData] = useState([]);

  const [courseSectionTableData, setCourseSectionTableData] = useState([]);

  const [selectedCourseSection, setSelectedCourseSection] = useState(null);

  const [showModal, setShowModal] = useState(false);

  let courseList = [];

  const [courseSectionTeacherList, setCourseSectionTeacherList] = useState({});

  const [teacherList, setTeacherList] = useState([]);

  const [courseTableLoading, setCourseTableLoading] = useState(false);

  const [courseSectionTableLoading, setCourseSectionTableLoading] =
    useState(false);

  const [courseSectiontableParams, setCourseSectionTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [coursetableParams, setCourseTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 3,
    },
  });

  const [shouldUpdate, setShouldUpdate] = useState(true);

  const [value, setValue] = useState(1);

  const [loadings, setLoadings] = useState([]);

  function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  const uploadCourses = async ({ file, onSuccess, onError }) => {
    // Create a FormData object to hold the file and additional parameter
    const formData = new FormData();
    formData.append('file', file); // Append the file
    try {
      // Simulate API call to upload file with additional parameter
      const response = await axiosPrivate.post('/course/upload', formData, {
        headers: {
          "Custom-Header": "value",
          "Content-type": "multipart/form-data",
        }
      });

      console.log(response.data); // Log response data
      if (response.status === 200) {
        showSuccessMessage(response.data);
        setShouldUpdate(true); // reload UI
        onSuccess(); // Call onSuccess callback provided by Ant Design Upload component
      } else {
        console.log(response.data.body + " binh");
        showErrorMessage(response.data.body);
        onError(new Error('Upload failed')); // Call onError callback provided by Ant Design Upload component
      }
    } catch (error) {
      console.log(error.request.response);
      if (isJSONString(error.request.response)) {
        const temp = JSON.parse(error.request.response);
        showErrorMessage(temp.join("\n"));
      } else {
        showErrorMessage(error.request.response);
      }
      onError(error); // Call onError callback provided by Ant Design Upload component
    }
  };

  const propsCourse = {
    beforeUpload: (file) => {
      const isCSV = file.name.toLowerCase().endsWith('.csv');
      if (!isCSV) {
        message.error(`${file.name} không đúng định dạng CSV `);
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    multiple: false,
    customRequest: uploadCourses
  };

  const uploadCoursesSection = async ({ file, onSuccess, onError }) => {
    // Create a FormData object to hold the file and additional parameter
    const formData = new FormData();
    formData.append('file', file); // Append the file
    formData.append('sectionId', value)
    try {
      // Simulate API call to upload file with additional parameter
      const response = await axiosPrivate.post('/course_section/upload', formData, {
        headers: {
          "Custom-Header": "value",
          "Content-type": "multipart/form-data",
        }
      });

      console.log(response.data); // Log response data
      if (response.status === 200) {
        showSuccessMessage(response.data);
        setShouldUpdate(true); // reload UI
        onSuccess(); // Call onSuccess callback provided by Ant Design Upload component
      } else {
        console.log(response.data.body + " binh");
        showErrorMessage(response.data.body);
        onError(new Error('Upload failed')); // Call onError callback provided by Ant Design Upload component
      }
    } catch (error) {
      console.log(error.request.response);
      if (isJSONString(error.request.response)) {
        const temp = JSON.parse(error.request.response);
        showErrorMessage(temp.join("\n"));
      } else {
        showErrorMessage(error.request.response);
      }
      onError(error); // Call onError callback provided by Ant Design Upload component
    }
  };

  const propsCourseSection = {
    beforeUpload: (file) => {
      const isCSV = file.name.toLowerCase().endsWith('.csv');
      if (!isCSV) {
        message.error(`${file.name} không đúng định dạng CSV `);
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    multiple: false,
    customRequest: uploadCoursesSection
  };



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
        // setCourseSectionTeacherList(response.data.body);
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

  const getCourseSections = async (value = 1) => {
    setCourseSectionTableData([]);
    setCourseSectionTableLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/course_section/${value}?page=${courseSectiontableParams.pagination.current - 1
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
          let teacherList = "";
          if (res.teacherName.length <= 1) {
            teacherList = res.teacherName[0].userName;
          } else {
            teacherList = res.teacherName.reduce((acc, teacher) => {
              return acc + ", " + teacher.userName;
            }, "");
            // console.log(teacherList);
            teacherList = teacherList.slice(1, teacherList.length);
          }
          courseSection = {
            ...courseSection,
            teacherList,
          };
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
      form1.isFieldTouched("semester") && form1.isFieldTouched("year")
    );
  }

  const handleShowAddTeacherModal = async (course) => {
    // setCourseSectionTeacherList({});
    setSelectedCourseSection(course.id);
    setShowModal(true);
    await fetchTeacherList(course.id);
  };

  const handleCloseModalDetail = () => {
    setShowModal(false);
  };

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

  const fetchTeacherList = async (courseId) => {
    try {
      // Check if student list for this course is already cached
      if (courseSectionTeacherList[courseId]) {
        // If cached, set the student list from cache
        return courseSectionTeacherList[courseId];
      } else {
        // If not cached, fetch student list from server
        const response = await axiosPrivate.get(`/teacher_teach`, {
          params: { id: courseId },
        });

        const teachers = response.data.map((teacher, index) => {
          return {
            ...teacher,
            dob: teacher.dob.substring(0, 10),
            no: index + 1,
          };
        });
        // Cache the student list for this course

        setCourseSectionTeacherList({ ...courseSectionTeacherList, [courseId]: teachers });

        // console.log(CourseSectionTeacherList);

        return teachers;
      }
    } catch (error) {
      console.error("Error fetching student list:", error);
      return [];
    }
  };

  const handleChange = (value) => {
    setValue(value);
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
      getCourseSections(value);
      getTeachers();
      setShouldUpdate(false); // Reset shouldUpdate after fetching data
    }
  }, [shouldUpdate, value]);

  useEffect(() => {
    getCourseSections(value);
  }, [JSON.stringify(courseSectiontableParams), value]);

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
              label="year"
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

            <div>
              <p style={{ whiteSpace: "pre-wrap", display: "inline-block", marginRight: "20px" }}>Danh sách lớp môn học</p>
              <Upload {...propsCourse} style={{ display: "inline-block" }}>
                <Button icon={<UploadOutlined />}>Upload danh sách môn học</Button>
              </Upload>
            </div>

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
          <Upload {...propsCourseSection} style={{ display: "inline-block" }}>
            <Button icon={<UploadOutlined />}>Upload danh sách LMH</Button>
          </Upload>

          <Table
            columns={courseSectionTableColumns}
            dataSource={courseSectionTableData}
            pagination={courseSectiontableParams.pagination}
            loading={courseSectionTableLoading}
            onChange={handleCourseSectionTableChange}
            rowKey={(record) => record.id}
          />
        </div>
      </div>

      <AddTeacherModal
        teacherList={teacherList}
        show={showModal}
        onClose={handleCloseModalDetail}
        selectedCourse={selectedCourseSection}
        courseSectionTeacherList={courseSectionTeacherList}
        setCourseSectionTeacherList={setCourseSectionTeacherList}
      />

    </>
  );
};

export default AddCourse;
