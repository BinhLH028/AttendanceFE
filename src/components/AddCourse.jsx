import { Button, Form, Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import AddStudentModal from "./AddStudentModal";

const AddCourse = () => {
    const axiosPrivate = useAxiosPrivate();

    const [form1] = Form.useForm();

    const [form2] = Form.useForm();

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
        {
            title: 'Action',
            render: (_, course) =>
                tableData.length >= 1 ? (
                    <Button
                        type="primary"
                        shape="circle"
                        className="bg-[#1677ff]"
                        onClick={() => handleShowAddStudentModal(course)}>
                        +
                    </Button>
                ) : null,
        },
    ];

    const [tableData, setTableData] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState(null);

    const [showModal, setShowModal] = useState(false);

    let courseList = [];

    const [studentList, setStudentList] = useState({});

    const [loading, setLoading] = useState(false);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });

    const onCourseFinish = async (values) => {
        try {
            const response = await axiosPrivate.post("/course/new", values);
            console.log(response);
            if (response.status === 200) {
                showSuccessMessage('Tạo khóa học thành công!')
            }
        } catch (error) {
            console.log(error);
            showErrorMessage(error);
        }
    };

    const onSectionFinish = async (values) => {
        console.log(values);
        // try {
        //     const response = await axiosPrivate.post("/section/new", values);
        //     console.log(response);
        //     if (response.status === 200) {
        //         showSuccessMessage('Tạo học kì thành công!')
        //     }
        // } catch (error) {
        //     console.log(error);
        //     showErrorMessage(error);
        // }
    };

    function isFieldsTouched() {
        return form1.isFieldTouched('semester') && form1.isFieldTouched('startYear');
    }

    const getCourses = async () => {
        try {
            // setLoading(true);
            const response = await axiosPrivate.get("/course/all");
            console.log(response);
        } catch (error) {
            console.log(error);
            showErrorMessage(error);
        }
    };

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

    const getCourseSections = async () => {
        try {
            const response = await axiosPrivate.get("/course_section");
            if (response)
                response.data.body
                    .map(res => {
                        const courseSection = {};
                        const flatten = (source, prefix = '') => {
                            for (const key in source) {
                                if (typeof source[key] === 'object' && source[key] !== null) {
                                    flatten(source[key], key + '.');
                                } else {
                                    courseSection[key] = source[key];
                                }
                            }
                        };
                        flatten(res);
                        courseList.push(courseSection);
                    });
            setTableData(courseList);
            console.log(courseList);
        } catch (error) {
            console.log(error);
            showErrorMessage(error);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
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
                const response = await axiosPrivate.get(`/course`, { params: { id: courseId } });
                const students = response.data;
                console.log(students);
                // Cache the student list for this course
                setStudentList({ ...studentList, [courseId]: students });

                return students;
            }
        } catch (error) {
            console.error('Error fetching student list:', error);
            return [];
        }
    };

    useEffect(() => {
        getCourses();
        // getSections();

        getCourseSections();
    }, [])

    return (
        <>
            <div
                className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <div className="w-full md:col-start-2 md:col-span-3 rounded-xl bg-gray-50 p-4">
                    <Form
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            width: '25rem',
                            maxWidth: 600,
                            paddingRight: '2rem'
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
                                    message: 'Học kì không được trống!',
                                },
                            ]}
                        >
                            <Select allowClear >
                                <Select.Option value="1">Học kì 1</Select.Option>
                                <Select.Option value="2">Học kì 2</Select.Option>
                                <Select.Option value="3">Học kì phụ</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="year"
                            label="Năm học"
                            rules={[
                                {
                                    required: true,
                                    message: '',
                                },
                            ]}
                        >
                            <Form.Item
                                name="startYear"
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
                                <Input type="number"/>
                            </Form.Item>
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '24px',
                                    lineHeight: '32px',
                                    textAlign: 'center',
                                }}
                            >
                                {/* - */}
                            </span>
                            {/* <Form.Item
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
                                    className="bg-[#1677ff]">
                                    Submit
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </div>
                <div className="w-full md:col-start-5 md:col-span-3 rounded-xl bg-gray-50 p-4">
                    <Form
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            width: '25rem',
                            maxWidth: 600,
                            paddingRight: '2rem'
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
                                    message: 'Mã lớp học không được trống!',
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
                                    message: 'Tên lớp học không được trống!',
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
                                        form2.getFieldsError().filter(({ errors }) => errors.length)
                                            .length > 0
                                    }
                                    className="bg-[#1677ff]">
                                    Submit
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div
                className="mt-6 flex justify-center">

                <div className="a w-3/4 md:col-span-4 rounded-xl bg-gray-100 p-4">
                    <p>Dach sách lớp môn học</p>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange} />
                </div>
            </div>
            <AddStudentModal
                data={studentList}
                show={showModal}
                onClose={handleCloseModalDetail}
            />
        </>
    );
}

export default AddCourse;