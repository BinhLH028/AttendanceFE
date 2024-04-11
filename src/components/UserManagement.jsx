import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import useAuth from "./hooks/useAuth";
import { Button, Form, Input, InputNumber, Select, Table, message, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { showErrorMessage, showSuccessMessage } from '../util/toastdisplay';


const UserManagement = () => {

    const axiosPrivate = useAxiosPrivate();

    function isJSONString(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (error) {
            return false;
        }
    }

    //#region teacher
    const teacherTableColumns = [
        {
            title: "No.",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "Họ và tên",
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
        // {
        //   title: "Action",
        //   render: (_, course) =>
        //     courseSectionTableData.length >= 1 ? (
        //       <Button
        //         type="primary"
        //         shape="circle"
        //         className="bg-[#1677ff]"
        //         onClick={() => handleShowAddStudentModal(course)}
        //       >
        //         +
        //       </Button>
        //     ) : null,
        // },
    ];

    const uploadTeacher = async ({ file, onSuccess, onError }) => {
        // Create a FormData object to hold the file and additional parameter
        const formData = new FormData();
        formData.append('file', file); // Append the file
        try {
            // Simulate API call to upload file with additional parameter
            const response = await axiosPrivate.post('/user/upload-teachers', formData, {
                headers: {
                    "Custom-Header": "value",
                    "Content-type": "multipart/form-data",
                }
            });

            if (response.status === 200) {
                showSuccessMessage(response.data);
                getTeachers();
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

    const propsTeachers = {
        beforeUpload: (file) => {
            const isCSV = file.name.toLowerCase().endsWith('.csv');
            if (!isCSV) {
                message.error(`${file.name} không đúng định dạng CSV `);
            }
            return isCSV || Upload.LIST_IGNORE;
        },
        multiple: false,
        customRequest: uploadTeacher
    };

    const [filterTeacher, setFilterTeacher] = useState({
        userName: null,
        email: null,
        phone: null,
        department: null
    });

    const [shouldBindKeyDownTableTeacher, setShouldBindKeyDownTableTeacher] = useState(false);

    const generateInputsTeacherTable = (columns) => {
        const inputs = [];
        columns.forEach(column => {
            if (column.dataIndex !== 'index') {
                inputs.push(
                    <Input
                        key={column.key}
                        placeholder={`${column.title}`}
                        className="w-48 py-1 px-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                        style={{ width: "100px", margin: "3px" }}
                        onChange={(e) => updateFilterTableTeacher(column.dataIndex, e.target.value)}
                        onKeyDown={shouldBindKeyDownTableTeacher ? (e) => handleEnterKeyPressTableTeacher(e) : null} // Listen for Enter key press
                        onFocus={() => setShouldBindKeyDownTableTeacher(true)} // Set shouldBindKeyDown to true when input is focused
                        onBlur={() => setShouldBindKeyDownTableTeacher(false)} // Reset shouldBindKeyDown when input loses focus
                    />
                );
            }
        });
        return inputs;
    };

    const handleEnterKeyPressTableTeacher = (e) => {
        if (e.key === 'Enter')
            getTeachers();
    }

    const updateFilterTableTeacher = async (propertyName, value) => {
        setFilterTeacher(prevState => ({
            ...prevState,
            [propertyName]: value
        }));
    };

    const inputTeachers = generateInputsTeacherTable(teacherTableColumns);

    const [teacherTableParams, setTeacherTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [teacherTableData, setTeacherTableData] = useState([]);

    const [teacherTableLoading, setTeacherTableLoading] = useState(true);

    const handleTeacherTableChange = (pagination, filters, sorter) => {
        setTeacherTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }

    useEffect(() => {
        getTeachers();
    }, [teacherTableParams.current, teacherTableParams.pageSize]);

    let teacherList = [];

    const getTeachers = async () => {
        setTeacherTableData([]);
        setTeacherTableLoading(true);

        try {
            const response = await axiosPrivate.post(`/teacher?page=${teacherTableParams.pagination.current - 1}`, filterTeacher);
            response.data.body.content.map((teacher, index) => {
                const item = {
                    index: (parseInt(teacherTableParams.pagination.current) - 1) *
                        parseInt(teacherTableParams.pagination.pageSize) + index + 1,
                    ...teacher,
                    dob: teacher.dob.substring(0, 10).split('-').reverse().join('-'),
                }
                teacherList.push(item)
            });
            setTeacherTableData(teacherList);
            setTeacherTableLoading(false);
            setTeacherTableParams({
                ...teacherTableParams,
                pagination: {
                    ...teacherTableParams.pagination,
                    total: response.data.body.totalElements,
                },
            });
        } catch (error) {
            setTeacherTableLoading(false);
            showErrorMessage(error);
        }
    };
    //#endregion
    //#region student
    const studentTableColumns = [
        {
            title: "No.",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "MSV",
            dataIndex: "userCode",
            key: "userCode",
        },
        {
            title: "Họ và tên",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
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
        },
        // {
        //   title: "Action",
        //   render: (_, course) =>
        //     courseSectionTableData.length >= 1 ? (
        //       <Button
        //         type="primary"
        //         shape="circle"
        //         className="bg-[#1677ff]"
        //         onClick={() => handleShowAddStudentModal(course)}
        //       >
        //         +
        //       </Button>
        //     ) : null,
        // },
    ];

    const uploadStudent = async ({ file, onSuccess, onError }) => {
        // Create a FormData object to hold the file and additional parameter
        const formData = new FormData();
        formData.append('file', file); // Append the file
        try {
            // Simulate API call to upload file with additional parameter
            const response = await axiosPrivate.post('/user/upload-students', formData, {
                headers: {
                    "Custom-Header": "value",
                    "Content-type": "multipart/form-data",
                }
            });

            if (response.status === 200) {
                console.log(response);
                showSuccessMessage(response.data);
                getStudents();
                onSuccess(); // Call onSuccess callback provided by Ant Design Upload component
            } else {
                console.log(response);
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

    const propsStudents = {
        beforeUpload: (file) => {
            const isCSV = file.name.toLowerCase().endsWith('.csv');
            if (!isCSV) {
                message.error(`${file.name} không đúng định dạng CSV `);
            }
            return isCSV || Upload.LIST_IGNORE;
        },
        multiple: false,
        customRequest: uploadStudent
    };

    const [shouldBindKeyDownTableStudent, setShouldBindKeyDownTableStudent] = useState(false);

    const generateInputsStudentTable = (columns) => {
        const inputs = [];
        columns.forEach(column => {
            if (column.dataIndex !== 'index') {
                inputs.push(
                    <Input
                        key={column.key}
                        placeholder={`${column.title}`}
                        className="w-48 py-1 px-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                        style={{ width: "100px", margin: "3px" }}
                        onChange={(e) => updateFilterTableStudent(column.dataIndex, e.target.value)}
                        onKeyDown={shouldBindKeyDownTableStudent ? (e) => handleEnterKeyPressTableStudent(e) : null} // Listen for Enter key press
                        onFocus={() => setShouldBindKeyDownTableStudent(true)} // Set shouldBindKeyDown to true when input is focused
                        onBlur={() => setShouldBindKeyDownTableStudent(false)} // Reset shouldBindKeyDown when input loses focus
                    />
                );
            }
        });
        return inputs;
    };


    const [filterStudent, setFilterStudent] = useState({
        userCode: null,
        userName: null,
        email: null,
        phone: null,
        schoolYear: null
    });

    const handleEnterKeyPressTableStudent = (e) => {
        if (e.key === 'Enter')
            getStudents();
    }

    const updateFilterTableStudent = async (propertyName, value) => {
        setFilterStudent(prevState => ({
            ...prevState,
            if(value = "") {
                value = null
            },
            [propertyName]: value
        }));
    };

    const inputStudents = generateInputsStudentTable(studentTableColumns);

    const [studentTableData, setStudentTableData] = useState([]);

    const [studentTableParams, setStudentTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [studentTableLoading, setStudentTableLoading] = useState(true);

    const handleStudentTableChange = (pagination, filters, sorter) => {
        setTeacherTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }

    useEffect(() => {
        getStudents();
    }, [studentTableParams.current, studentTableParams.pageSize]);

    let studentList = [];

    const getStudents = async () => {
        setStudentTableData([]);
        setStudentTableLoading(true);

        try {
            const response = await axiosPrivate.post(`/student?page=${studentTableParams.pagination.current - 1}`, filterStudent);
            response.data.body.content.map((student, index) => {
                const item = {
                    index: (parseInt(studentTableParams.pagination.current) - 1) *
                        parseInt(studentTableParams.pagination.pageSize) + index + 1,
                    ...student,
                    dob: student.dob.substring(0, 10).split('-').reverse().join('-'),
                }
                studentList.push(item)
            });
            setStudentTableData(studentList);
            setStudentTableLoading(false);
            setStudentTableParams({
                ...studentTableParams,
                pagination: {
                    ...studentTableParams.pagination,
                    total: response.data.body.totalElements,
                },
            });
        } catch (error) {
            setTeacherTableLoading(false);
            showErrorMessage(error);
        }
    };
    //#endregion
    useEffect(() => {
    }, []);

    return (
        <>
            <div className="h-screen grid grid-cols-10 grid-rows-4 gap-4 rounded-xl mr-5">
                <div className="col-span-10 row-span-full col-start-0 bg-gray-50 rounded-xl flex flex-col justify-start items-center">
                    <div className="flex flex-row justify-between w-full h-full  p-2">
                        <div className="overflow-x-auto whitespace-no-wrap w-[calc(50%-2.5px)] bg-red-300 ">
                            <div className=" bg-gray-100 p-2 rounded-xl ">
                                {inputTeachers}
                                <Upload {...propsTeachers} style={{ display: "inline-block" }}>
                                    <Button icon={<UploadOutlined />}>Upload danh sách giảng viên</Button>
                                </Upload>
                            </div>
                            <Table
                                columns={teacherTableColumns}
                                dataSource={teacherTableData}
                                pagination={teacherTableParams.pagination}
                                loading={teacherTableLoading}
                                onChange={handleTeacherTableChange}
                                rowKey={(record) => record.id}
                                size="small"
                            />
                        </div>
                        <div className="w-[calc(50%-2.5px)] bg-blue-300 ">
                            <div className=" bg-gray-100 p-2 rounded-xl ">
                                {inputStudents}
                                <Upload {...propsStudents} style={{ display: "inline-block" }}>
                                    <Button icon={<UploadOutlined />}>Upload sinh viên</Button>
                                </Upload>
                            </div>
                            <Table
                                columns={studentTableColumns}
                                dataSource={studentTableData}
                                pagination={studentTableParams.pagination}
                                loading={studentTableLoading}
                                onChange={handleStudentTableChange}
                                rowKey={(record) => record.id}
                                size="small"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserManagement;