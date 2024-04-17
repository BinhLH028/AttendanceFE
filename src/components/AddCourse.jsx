import { Button, Form, Input, InputNumber, Typography, Popconfirm, Select, Table, message, Upload, Skeleton, Modal } from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import AddTeacherModal from "./AddTeacherModal";
import "./../style/AddCourse.css";
import DebounceSelect from "./DebounceSelect"
import MultiSelectWithPagination from "./MultiSelectWithPagination";

const MAX_COUNT = 5;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = dataIndex === 'dob' ? <DatePicker format={"DD-MM-YYYY"} /> : <Input style={{ width: '115px', height: '25px' }} />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AddCourse = () => {
  const axiosPrivate = useAxiosPrivate();

  const [form1] = Form.useForm();

  const [form2] = Form.useForm();

  const [form3] = Form.useForm();

  const [teacherOptions, setTeacherOptions] = useState([]);

  const [sectionOptions, setSectionOptions] = useState([]);

  const [editingCourseKey, setEditingCourseKey] = useState('');
  const isEditingCourse = (record) => record.courseId === editingCourseKey;

  const [formEditCourse] = Form.useForm();

  const courseTableColumns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Mã lớp học",
      dataIndex: "courseCode",
      key: "courseCode",
      editable: true,
    },
    {
      title: "Tên lớp học",
      dataIndex: "courseName",
      key: "courseName",
      editable: true,
    },
    {
      title: "Action",
      render: (_, course) => {
        const editable = isEditingCourse(course);
        return editable && courseTableData.length >= 1 ? (
          <span>
            <Typography.Link
              onClick={() => saveCourse(course.courseId)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelCourse}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingCourseKey !== ''} onClick={() => editCourse(course)}>
              Edit
            </Typography.Link>
            <Typography.Link onClick={() => showDeleteConfirm(course.courseId)} style={{ marginLeft: 8, color: "red" }}>
              Delete
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const showDeleteConfirm = (courseId) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xoá môn học này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Việc này sẽ xoá tất cả dữ liệu trong mọi học kỳ của môn này',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteCourse(courseId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteCourse = async (courseId) => {
    try {
      let response;
      response = await axiosPrivate.post(`/course/delete/${courseId}`);
      showSuccessMessage(response.data)
      getCourses();
      getCourseSections(value);
    } catch (error) {
      showErrorMessage(error);
    }
  }

  const mergeCourseColumns = courseTableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingCourse(record),
      }),
    };
  });

  const editCourse = (record) => {
    console.log(record.courseId);
    formEditCourse.setFieldsValue({
      courseCode: '',
      courseName: '',
      ...record,
    });
    setEditingCourseKey(record.courseId);
  };

  const cancelCourse = () => {
    setEditingCourseKey('');
  };

  const saveCourse = async (key) => {
    try {
      const row = await formEditCourse.validateFields();
      const newData = [...courseTableData];

      const index = newData.findIndex((item) => {
        return key === item.courseId
      });

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newData[index]);
        setCourseTableData(newData);
        updateCourseInfo(newData[index]);
        setEditingCourseKey('');
      } else {
        newData.push(row);
        setCourseTableData(newData);
        updateCourseInfo(newData[index]);
        setEditingCourseKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const updateCourseInfo = async (item) => {
    try {
      let response;
      response = await axiosPrivate.post(`/course/update/${item.courseId}`, item);
      showSuccessMessage(response.data.body)
      getCourseSections(value);
    } catch (error) {
      showErrorMessage(error);
    }
  }

  const courseSectionTableColumns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
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
      title: "Nhóm",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Giảng viên",
      dataIndex: "teacherList",
      key: "teacherList",
    },
    {
      title: "Giảng đường",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Action",
      render: (_, course) =>
        courseSectionTableData.length >= 1 ? (
          <>
            <Button
              type="primary"
              shape="circle"
              className="bg-[#1677ff]"
              onClick={() => handleShowAddTeacherModal(course)}
            >
              +
            </Button>
            <Button
              id="btn-del-CS"
              type="primary"
              shape="circle"
              className="bg-[#D30000]"
              style={{
                marginLeft: "5px",
              }}
              onClick={() => handleDeleteCourseSection(course)}
            >
              -
            </Button>
          </>

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
      pageSize: 5,
    },
  });

  const [value, setValue] = useState();

  const [loadings, setLoadings] = useState([]);

  function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  const [fromYear, setFromYear] = useState(null);
  const [toYear, setToYear] = useState(null);

  const handleFromYearChange = (value) => {
    setFromYear(value);
    setToYear(value + 1);
  };

  const handleToYearChange = (value) => {
    setToYear(value);
    setFromYear(value - 1);
  };

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

      if (response.status === 200) {
        showSuccessMessage(response.data);
        getCourses();
        onSuccess(); // Call onSuccess callback provided by Ant Design Upload component
      } else {
        showErrorMessage(response.data.body);
        onError(new Error('Upload failed')); // Call onError callback provided by Ant Design Upload component
      }
    } catch (error) {
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

      if (response.status === 200) {
        showSuccessMessage(response.data);
        getCourseSections(value);
        onSuccess(); // Call onSuccess callback provided by Ant Design Upload component
      } else {
        showErrorMessage(response.data.body);
        onError(new Error('Upload failed')); // Call onError callback provided by Ant Design Upload component
      }
    } catch (error) {
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
      let courseList = response.data.body.map((course, index) => {
        return { index: index + 1, ...course, value: course.courseId, label: course.courseCode };
      });
      setCourseTableData(courseList);
    } catch (error) {
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
        });
        setSectionOptions(listData);
      }
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const getCourseSections = async (value) => {
    setCourseSectionTableData([]);
    setCourseSectionTableLoading(true);
    try {
      
      if (value == undefined){
        setCourseSectionTableLoading(false);
        return;
      }
      const response = await axiosPrivate.get(
        `/course_section/${value}?page=${courseSectiontableParams.pagination.current - 1
        }`
      );
      if (response)
        response.data.body.content?.map((res, index) => {
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
          if (res.teacherName != null || res.teacherName != undefined)
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
            index: index + 1,
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
    } catch (error) {
      showErrorMessage(error);
      console.log(error);
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
            label: res.userName,
            value: res.userId,
          });
        });
        setTeacherOptions(listData);
      }
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const onCourseFinish = async (values) => {
    try {
      const response = await axiosPrivate.post("/course/new", values);
      if (response.status === 200) {
        showSuccessMessage("Tạo khóa học thành công!");
      }
      form2.resetFields();
      getCourses();
      setLoadings([]);
    } catch (error) {
      showErrorMessage(error.request.response);
    }
  };

  const onSectionFinish = async (values) => {
    const { semester } = values;
    const newValues = { ...values, year: `${fromYear}-${toYear}` };
    try {
      const response = await axiosPrivate.post("/section/new", newValues);
      if (response.status === 200) {
        showSuccessMessage("Tạo học kì thành công!");
      }
      form1.resetFields();
      getSections();
      setLoadings([]);
    } catch (error) {
      showErrorMessage(error.request.response);
    }
  };

  const onCourseSectionFinish = async (values) => {

    const data = { ...values, sectionId: value, courseId: values.courseId.value };

    if (value == undefined) {
      setValue(sectionOptions[0].value)
      data = { ...values, sectionId: sectionOptions[0].value, courseId: values.courseId.value };
    }

    try {
      const response = await axiosPrivate.post("/course_section/create", data);
      if (response.status === 200) {
        showSuccessMessage("Tạo khóa học thành công!");
      }
      form3.resetFields();
      getCourseSections(value);
      setLoadings([]);
    } catch (error) {
      showErrorMessage(error.request.response);
    }
  };

  function isFieldsTouchedF3() {
    return (
      form3.isFieldTouched("courseId") && form3.isFieldTouched("teachersId")
    );
  }

  const handleDeleteCourseSection = async (course) => {

    Modal.confirm({
      title: 'Bạn có chắc muốn xoá lớp môn học này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Việc này sẽ xoá tất cả dữ liệu trong học kỳ của môn này',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteCourseSection(course.id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteCourseSection = async (id) => {
    try {
      let response;
      response = await axiosPrivate.post(`/course_section/delete?csId=${id}`);
      showSuccessMessage(response.data)
      getCourseSections(value);
    } catch (error) {
      showErrorMessage(error);
    }
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
        let teachers = []
        try {
          const response = await axiosPrivate.get(`/teacher_teach`, {
            params: { id: courseId },
          });

          teachers = response.data.map((teacher, index) => {
            return {
              ...teacher,
              dob: teacher.dob.substring(0, 10).split('-').reverse().join('-'),
              no: index + 1,
            };
          });

          setCourseSectionTeacherList({ ...courseSectionTeacherList, [courseId]: teachers });
        } catch (error) {
          console.error(error);

          setCourseSectionTeacherList({ ...courseSectionTeacherList, [courseId]: teachers });
        }
        return teachers;
      }
    } catch (error) {
      console.error("Error fetching student list:", error);
      // return [];
    }
  };

  const handleChange = (value) => {
    setValue(value);
  };

  useEffect(() => {
    getCourses();
    getSections();
    getTeachers();
  }, []);

  useEffect(() => {
    getCourseSections(value);
  }, [JSON.stringify(courseSectiontableParams), value]);

  const [debounceVal, setDebounceVal] = useState([]);

  async function fetchCourseByFilter(code) {

    const response = await axiosPrivate.post(`/course/code?c=${code}`);
    let courseList = response.data.body.map((course, index) => {
      return { index: index + 1, ...course, value: course.courseId, label: course.courseCode };
    });
    return courseList;
  }

  return (
    <>
      <div className="h-screen grid grid-cols-10 grid-rows-7 gap-4 rounded-xl mr-5"
        style={{ minWidth: "81.25rem", overflow: "hidden" }}>
        <div className="col-span-3 row-span-2 bg-gray-50 rounded-xl p-4 min-w-64 overflow-auto">
          <Form
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              minWidth: 350,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onSectionFinish}
            autoComplete="off"
            form={form1}
            className="h-36"
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
              label="Năm học"
              name="year"
            >
              <InputNumber
              style={{marginRight:"5px"}}
                type="number"
                min={0}
                max={new Date().getFullYear() - 1} // Adjusted max value to allow only up to the year before the current year
                value={fromYear}
                onChange={handleFromYearChange}
                
              /> -
              <InputNumber
              style={{marginLeft:"5px"}}
                type="number"
                min={1}
                max={new Date().getFullYear()} // Minimum value set to 1 greater than the "from" year
                value={toYear}
                onChange={handleToYearChange}
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
                    form1.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  }
                  className="bg-[#1677ff]"
                  loading={loadings[0]}
                  onClick={() => enterLoading(0)}
                >
                  Thêm học kỳ
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>

        <div className="col-span-3 row-span-5 rounded-xl bg-gray-50 p-4 min-w-64 overflow-auto">
          <div
            className="md:col-span-4 rounded-xl h-full"
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
                    Thêm môn học
                  </Button>
                )}
              </Form.Item>
            </Form>

            <div>
              <p style={{ whiteSpace: "pre-wrap", display: "inline-block", marginRight: "20px" }}>Danh sách môn học</p>
              <Upload {...propsCourse} style={{ display: "inline-block" }}>
                <Button icon={<UploadOutlined />}>Upload danh sách môn học</Button>
              </Upload>
            </div>

            <Form form={formEditCourse} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                rowKey="courseId"
                columns={mergeCourseColumns}
                dataSource={courseTableData}
                // pagination={coursetableParams.pagination}
                pagination={{ pageSize: 5 }}
                loading={courseTableLoading}
                rowClassName="editable-row"
                // onChange={handleCourseTableChange}
                scroll={{
                  y: 250,
                }}
              />
            </Form>
          </div>
        </div>

        <div className="col-span-7 row-span-full col-start-4 bg-gray-50 rounded-xl "
          style={{ minWidth: "1000", overflow: "hidden" }}
        >
          {sectionOptions.length ?
            <Select
              allowClear
              style={{
                width: "20%",
                margin: "10px",
              }}
              placeholder="Chọn học kỳ"
              onChange={handleChange}
              options={sectionOptions}
              // defaultValue={sectionOptions[0]}
            /> :
            <Skeleton.Input active={true} size="large" />
          }
          <Upload {...propsCourseSection} style={{ display: "inline-block" }}>
            <Button icon={<UploadOutlined />}>Upload danh sách LMH</Button>
          </Upload>
          <Form className="grid grid-cols-12 grid-rows-1 gap-3"
            labelCol={{
              span: 10,
            }}
            wrapperCol={{
              span: 20,
            }}
            // style={{
            //   width: "auto",
            //   paddingRight: "2rem",
            //   zIndex: -10,
            //   display: 'flex',
            //   flexDirection: 'row',
            // }}
            initialValues={{
              remember: true,
              team: 'CL' // Set default value for the 'team' field here
            }}
            onFinish={onCourseSectionFinish}
            autoComplete="off"
            form={form3}
          >
            <Form.Item
              className="col-span-3"
              label="Mã lớp học"
              name="courseId"
              // style={{ width: 'auto', margin: '0 1rem' }}
              rules={[
                {
                  required: true,
                  message: "Mã lớp học không được trống!",
                },
              ]}
            >
              {sectionOptions.length ?
                // <Select
                //   allowClear
                //   showSearch
                //   style={{
                //     width: "8rem",
                //   }}
                //   placeholder="Chọn môn học"
                //   options={courseTableData}
                //   filterOption={(input, option) =>
                //     option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                //   }
                //   maxTagCount={5}
                // />
                <DebounceSelect
                  mode="single"
                  showSearch
                  value={debounceVal}
                  placeholder="Chọn môn học"
                  fetchOptions={fetchCourseByFilter}
                  onChange={(newValue) => {
                    setDebounceVal(newValue);
                  }}
                  style={{
                    width: '100%',
                  }}
                />
                :
                <Skeleton.Input active={true} size="large" />
              }
            </Form.Item>
            <Form.Item
              className="col-span-2 col-start-4"
              label="Nhóm"
              name="team"
              // style={{
              //   width: "8rem",
              // }}
              rules={[
                {
                  required: false,
                  message: "Nhóm không được trống!",
                }
              ]}
            >
              <Select style={{ width: '80%', marginLeft: "10px" }}>
                <Select.Option value="CL">CL</Select.Option>
                <Select.Option value="N1">N1</Select.Option>
                <Select.Option value="N2">N2</Select.Option>
                <Select.Option value="N3">N3</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              className="col-span-3 col-start-6"
              label="Giảng viên"
              name="teachersId"
              // style={{ width: '25rem', marginRight: "0rem" }}
              rules={[
                {
                  required: true,
                  message: "Giảng viên không được trống!",
                }
              ]}
            >
              {Array.isArray(teacherList) && teacherList.length > 0 ? (
                <Select
                  required
                  showSearch
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  options={
                    teacherList.map((teacher) => ({
                      value: teacher.userId,
                      label: teacher.userName,
                    }))
                  }
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  maxCount={4}
                />
              ) : (
                <div>No teacher data available</div>
              )}
              {/* <MultiSelectWithPagination
                apiEndpoint="/course_section/1"
                optionLabelKey="courseCode"
                optionValueKey="id"
                pageSize={10}
                debounceTime={1500}
                onChange={selectedValues => console.log('Selected:', selectedValues)}
                style={{ width: '80%', marginLeft: "25px" }}
              /> */}
            </Form.Item>
            <Form.Item
              className="col-span-2 col-start-9"
              label="Phòng"
              name="room"
            // style={{ width: '20%', marginLeft: "20px" }}
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
                  // style={{ marginRight: "20px" }}
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !isFieldsTouchedF3(true) ||
                    form3
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length > 0
                  }
                  className="bg-[#1677ff]"
                  loading={loadings[1]}
                  onClick={() => enterLoading(1)}
                >
                  Thêm lớp môn học
                </Button>
              )}
            </Form.Item>
          </Form>
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
        currentCS={value}
        teacherList={teacherList}
        show={showModal}
        onClose={handleCloseModalDetail}
        setShowModal={setShowModal}
        selectedCourse={selectedCourseSection}
        courseSectionTeacherList={courseSectionTeacherList}
        setCourseSectionTeacherList={setCourseSectionTeacherList}
        getCourseSections={getCourseSections}
      />

    </>
  );
};

export default AddCourse;
