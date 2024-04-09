import { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, Table, message, Upload, Skeleton } from "antd";
import './../style/AddSemester.css';
import AddStudentModal from './AddStudentModal';
import { UploadOutlined } from '@ant-design/icons';
import { showErrorMessage, showSuccessMessage } from '../util/toastdisplay';
import useAxiosPrivate from './hooks/useAxiosPrivate';

const AddSemester = () => {

  const axiosPrivate = useAxiosPrivate();

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

  const [courseSectionTableData, setCourseSectionTableData] = useState([]);

  const [selectedCourseSection, setSelectedCourseSection] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [courseSectiontableParams, setCourseSectionTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [courseSectionTableLoading, setCourseSectionTableLoading] = useState(true);

  const [courseSectionStudentList, setCourseSectionStudentList] = useState({});

  const [studentList, setStudentList] = useState([]);

  const [studentOptions, setStudentOptions] = useState([]);

  const [value, setValue] = useState(1);

  const [sectionOptions, setSectionOptions] = useState([]);

  let courseList = [];

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

  const handleShowAddStudentModal = async (course) => {
    // setCourseSectionTeacherList({});
    setSelectedCourseSection(course.id);
    setShowModal(true);
    await fetchStudentList(course.id);
  };

  const fetchStudentList = async (courseId) => {
    try {
      // Check if student list for this course is already cached
      if (courseSectionStudentList[courseId]) {
        // If cached, set the student list from cache
        return courseSectionStudentList[courseId];
      } else {
        // If not cached, fetch student list from server
        let students = []
        try {
          const response = await axiosPrivate.get(`/student_enrolled`, {
            params: { id: courseId },
          });

          students = response.data.map((student, index) => {
            return {
              ...student,
              // username: student.username,
              userCode: student.userCode,
              dob: student.dob.substring(0, 10),
              no: index + 1,
            };
          });

          setCourseSectionStudentList({ ...courseSectionStudentList, [courseId]: students });
        } catch (error) {
          console.error(error);

          setCourseSectionStudentList({ ...courseSectionStudentList, [courseId]: students });
        }
        return students;
      }
    } catch (error) {
      console.error("Error fetching student list:", error);
      return [];
    }
  };

  const getStudents = async () => {
    try {
      const response = await axiosPrivate.get("/student/all");
      if (response) {
        setStudentList(response.data.body);
        var listData = [];
        response.data.body.map((res) => {
          listData.push({
            label: res.userName,
            value: res.userId,
          });
        });
        setStudentOptions(listData);
      }
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

  const getCourseSections = async (value = 1) => {
    setCourseSectionTableData([]);
    setCourseSectionTableLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/course_section/${value}?page=${courseSectiontableParams.pagination.current - 1
        }`
      );
      if (response)
        response.data.body.content.map((res, index) => {
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
          if (res.teacherName !== null) {
            if (res.teacherName.length <= 1) {
              teacherList = res.teacherName[0].userName;
            } else {
              teacherList = res.teacherName.reduce((acc, teacher) => {
                return acc + ", " + teacher.userName;
              }, "");
              // console.log(teacherList);
              teacherList = teacherList.slice(1, teacherList.length);
            }
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
      setCourseSectionTableLoading(false);
    }
  };

  const handleCloseModalDetail = () => {
    setShowModal(false);
  };

  const handleChange = (value) => {
    setValue(value);
  };

  function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  const uploadEnroll = async ({ file, onSuccess, onError }) => {
    // Create a FormData object to hold the file and additional parameter
    const formData = new FormData();
    formData.append('file', file); // Append the file
    formData.append('sectionId', value)
    try {
      // Simulate API call to upload file with additional parameter
      const response = await axiosPrivate.post('/student_enrolled/upload', formData, {
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

  const propsCourse = {
    beforeUpload: (file) => {
      const isCSV = file.name.toLowerCase().endsWith('.csv');
      if (!isCSV) {
        message.error(`${file.name} không đúng định dạng CSV `);
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    multiple: false,
    customRequest: uploadEnroll
  };

  useEffect(() => {
    getCourseSections(value);
  }, [JSON.stringify(courseSectiontableParams), value])

  useEffect(() => {
    getSections();
    getStudents();
  }, [])

  return (
    <>
      <div className="h-screen grid grid-cols-10 grid-rows-4 gap-4 rounded-xl mr-5">
        <div className="col-span-10 row-span-full col-start-0 bg-gray-50 rounded-xl flex flex-col justify-start items-center">
          {sectionOptions.length ?
            <div >
              <Select className="w-full"
                allowClear
                style={{
                  width: "auto",
                  margin: "10px",
                }}
                placeholder="Chọn học kỳ"
                onChange={handleChange}
                options={sectionOptions}
                defaultValue={sectionOptions[0]}
              />

              <Upload {...propsCourse} style={{ display: "inline-block" }}>
                <Button icon={<UploadOutlined />}>Upload danh sách sinh viên</Button>
              </Upload>
            </div>  :
              <Skeleton.Input active={true} size="large" />
          }
          <div className="overflow-x-auto whitespace-no-wrap w-full">
            <Table
              columns={courseSectionTableColumns}
              dataSource={courseSectionTableData}
              pagination={courseSectiontableParams.pagination}
              loading={courseSectionTableLoading}
              onChange={handleCourseSectionTableChange}
              rowKey={(record) => record.id}
            />
          </div>
          <AddStudentModal
            studentList={studentList}
            show={showModal}
            onClose={handleCloseModalDetail}
            selectedCourse={selectedCourseSection}
            courseSectionStudentList={courseSectionStudentList}
            setCourseSectionStudentList={setCourseSectionStudentList}
            getCourseSections={getCourseSections}
          />
        </div>
      </div>
    </>
  );
};

export default AddSemester;