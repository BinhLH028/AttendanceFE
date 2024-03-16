import { Button, Form, Input, InputNumber, Select, Table } from "antd";
import { useEffect, useState } from "react";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import AddStudentModal from "./AddStudentModal";
import { DataGrid } from '@mui/x-data-grid';


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

        const [teacherList, setTeacherList] = useState([]);

        const [loading, setLoading] = useState(false);

        const [tableParams, setTableParams] = useState({
            pagination: {
                current: 1,
                pageSize: 5,
            },
        });

        useEffect(() => {
            getCourses();
            getSections();
            // setUpData();
            getCourseSections();
            getTeachers();
        }, [])

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

        const getSections = async () => {
            try {
                const response = await axiosPrivate.get("/section");
                if (response) {
                    setTeacherList(response.data.body)
                    var listData = [];
                    response.data.body.map(res => {
                        listData.push({
                            label: "Học kì " + res.semester + " năm " + res.year,
                            value: res.sectionId,
                        });
                        console.log(res);
                    })
                    setSectionOptions(listData);
                }
            } catch (error) {
                console.log(error);
                showErrorMessage(error);
            }

        };

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

        const getTeachers = async () => {
            try {
                const response = await axiosPrivate.get("/teacher/all");
                if (response) {
                    setTeacherList(response.data.body)
                    var listData = [];
                    response.data.body.map(res => {
                        listData.push({
                            label: res.username,
                            value: res.userId,
                        });
                        console.log(res);
                    })
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

        const handleChange = (value) => {
            setUpData();
        };

        const onCellEditCommit = (params) => {
            // params contains information about the edited cell
            console.log('Edited Cell:', params);

            // Access the entire row using params.row
            console.log('Entire Row:', params.row);

            // Store the edited cell for further use if needed
            setEditedCell(params);
        };


        return (
            <>
                <div className="grid grid-cols-10 grid-rows-3 gap-4 rounded-xl mr-5">
                    <div className="w-full col-span-3 bg-gray-50 rounded-xl p-4"
                        style={{
                            minWidth: "250px"
                        }}>
                        <Form
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                width: 'auto',
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
                                    {/* <Select.Option value="3">Học kì phụ</Select.Option> */}
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
                                            message: ''
                                        },
                                    ]}
                                >
                                    <InputNumber type="number" min={0} max={new Date().getFullYear()} />
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
                    <div className="col-span-3 row-span-2 row-start-2 rounded-xl bg-gray-50">
                        <div className=" md:col-span-4 rounded-xl  p-4"
                            style={{
                                minWidth: "400px",
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
                                    width: 'auto',
                                    maxWidth: 600,
                                    paddingRight: '2rem',
                                    zIndex: -10
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
                                    label="Giảng viên"
                                    name="Teacher"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'chưa có Giảng viên!',
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Please select"
                                        onChange={handleChange}
                                        options={teacherOptions}
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
                            <p>Dach sách lớp môn học</p>

                            <Table
                                columns={columns}
                                dataSource={tableData}
                                pagination={tableParams.pagination}
                                loading={loading}
                                onChange={handleTableChange} />
                        </div>

                    </div>
                    <div className="col-span-7 row-span-3 col-start-4 bg-gray-50 rounded-xl ">
                        <Select
                            allowClear
                            style={{
                                width: '20%',
                                margin: "10px"
                            }}
                            placeholder="Chọn học kỳ"
                            onChange={handleChange}
                            options={sectionOptions}
                        />

                        <Table
                            columns={columns}
                            dataSource={tableData}
                            pagination={tableParams.pagination}
                            loading={loading}
                            onChange={handleTableChange} />
                        {/* <DataGrid
                        rows={rowsCS}
                        columns={columnsCS}
                        pageSizeOptions={[]}
                        onCellEditCommit={onCellEditCommit} /> */}

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