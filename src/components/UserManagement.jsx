import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import useAuth from "./hooks/useAuth";
import { Button, Form, Input, DatePicker, InputNumber, Typography, Table, message, Upload, Popconfirm } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { showErrorMessage, showSuccessMessage } from '../util/toastdisplay';

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


const UserManagement = () => {

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    //teacher
    const [editingTeacherKey, setEditingTeacherKey] = useState('');
    const isEditingTeacher = (record) => record.userId === editingTeacherKey;
    //student
    const [editingStudentKey, setEditingStudentKey] = useState('');
    const isEditingStudent = (record) => record.userId === editingStudentKey;

    const editTeacher = (record) => {
        form1.setFieldsValue({
            userName: '',
            phone: '',
            department: '',
            ...record,
        });
        setEditingTeacherKey(record.userId);
    };

    const editStudent = (record) => {
        form2.setFieldsValue({
            userName: '',
            phone: '',
            schoolYear: '',
            ...record,
        });
        setEditingStudentKey(record.userId);
    };

    const cancelTeacher = () => {
        setEditingTeacherKey('');
    };

    const cancelStudent = () => {
        setEditingStudentKey('');
    };


    const saveTeacher = async (key) => {
        try {
            const row = await form1.validateFields();
            const newData = [...teacherTableData];
            const index = newData.findIndex((item) => {
                return key === item.userId
            });
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setTeacherTableData(newData);
                updateUserInfo(newData[index], true);
                setEditingTeacherKey('');
            } else {
                newData.push(row);
                setTeacherTableData(newData);
                updateUserInfo(newData[index], true);
                setEditingTeacherKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const saveStudent = async (key) => {
        try {
            const row = await form2.validateFields();
            const newData = [...studentTableData];
            const index = newData.findIndex((item) => {
                return key === item.userId
            });
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setStudentTableData(newData);
                updateUserInfo(newData[index], false);
                setEditingStudentKey('');
            } else {
                newData.push(row);
                setStudentTableData(newData);
                updateUserInfo(newData[index], false);
                setEditingStudentKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

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
            width: "25px",
            key: "index",
        },
        {
            title: "Họ và tên",
            dataIndex: "userName",
            key: "userName",
            width: "135px",
            editable: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            width: "150px",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            width: "125px",
            editable: true,
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
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditingTeacher(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => saveTeacher(record.userId)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancelTeacher}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingTeacherKey !== ''} onClick={() => editTeacher(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergeTeacherColumns = teacherTableColumns.map((col) => {
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
                editing: isEditingTeacher(record),
            }),
        };
    });

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
            if (column.dataIndex !== 'index' && column.dataIndex !== 'operation') {
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
            editable: true,
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
            editable: true,
        },
        {
            title: "Khoá",
            dataIndex: "schoolYear",
            key: "schoolYear",
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditingStudent(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => saveStudent(record.userId)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancelStudent}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingStudentKey !== ''} onClick={() => editStudent(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergeStudentColumns = studentTableColumns.map((col) => {
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
                editing: isEditingStudent(record),
            }),
        };
    });

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
            if (column.dataIndex !== 'index' && column.dataIndex !== 'operation') {
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

    const updateUserInfo = async (item, isTeacher) => {
        try {
            console.log(item);
            let response;
            if (isTeacher)
                response = await axiosPrivate.post(`/user/update/${item.userId}?type=t`, item);
            else {
                response = await axiosPrivate.post(`/user/update/${item.userId}?type=u`, item);
            }
            showSuccessMessage(response.data.body)
        } catch (error) {
            showErrorMessage(error);
        }
    }

    useEffect(() => {
    }, []);

    //#region password
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if new password and confirm password match
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirm password don't match");
            return;
        }

        // Reset error state if passwords match
        setError('');
        const updatedFormData = {
            ...formData,
            userId: auth.userData.userId,
            userName: auth.userData.userName
        };
        // Add your logic here to handle form submission
        try {
            const response = await axiosPrivate.post("/user/update", updatedFormData);
            if (response.status === 200) {
                showSuccessMessage("Thay đổi mật khẩu thành công");
            }
            formData.resetFields();
        } catch (error) {
            showErrorMessage(error.request.response);
        }
        // console.log(updatedFormData);
    };
    //#endregion

    return (
        ["ADMIN"].includes(auth.userData.role) ?
            <>
                <div className="h-screen grid grid-cols-10 grid-rows-4 gap-4 rounded-xl mr-5">
                    <div className="col-span-10 row-span-full col-start-0  rounded-xl flex flex-col justify-start items-center">
                        <div className="flex flex-row justify-between w-full h-full ">
                            <div className="overflow-x-auto whitespace-no-wrap w-[calc(50%-2.5px)] " style={{ borderRight: '2px solid gray',minWidth:"37.5rem" }}>
                                <div className=" bg-gray-100 p-2 rounded-xl " style={{}}>
                                    {inputTeachers}
                                    <Upload {...propsTeachers} style={{ display: "inline-block" }}>
                                        <Button icon={<UploadOutlined />}>Upload danh sách giảng viên</Button>
                                    </Upload>
                                </div>
                                <Form form={form1} component={false}>
                                    <Table
                                        components={{
                                            body: {
                                                cell: EditableCell,
                                            },
                                        }}
                                        bordered
                                        columns={mergeTeacherColumns}
                                        dataSource={teacherTableData}
                                        pagination={teacherTableParams.pagination}
                                        loading={teacherTableLoading}
                                        onChange={handleTeacherTableChange}
                                        rowClassName="editable-row"
                                        rowKey='userId'
                                        size="small"
                                    />
                                </Form>
                            </div>
                            <div className="w-[calc(50%-2.5px)]" style={{minWidth:"37.5rem"}}>
                                <div className=" bg-gray-100 p-2 rounded-xl " >
                                    {inputStudents}
                                    <Upload {...propsStudents} style={{ display: "inline-block" }}>
                                        <Button icon={<UploadOutlined />}>Upload sinh viên</Button>
                                    </Upload>
                                </div>
                                <Form form={form2} component={false}>

                                    <Table
                                        components={{
                                            body: {
                                                cell: EditableCell,
                                            },
                                        }}
                                        bordered
                                        columns={mergeStudentColumns}
                                        dataSource={studentTableData}
                                        pagination={studentTableParams.pagination}
                                        loading={studentTableLoading}
                                        onChange={handleStudentTableChange}
                                        rowClassName="editable-row"
                                        rowKey='userId'
                                        size="small"
                                    />
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </> :
            <div className="grid grid-cols-5 grid-rows-7 gap-4 h-full">
                {/* <div className="col-span-5 row-span-2 bg-gray-300"></div> */}
                <div className="col-span-5 row-span-2 row-start-3 bg-gray-150 flex">
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <div className="flex flex-col sm:flex-row">
                            <input
                                type="password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                placeholder="Current Password"
                                className="mb-4 px-4 py-2 border border-gray-300 rounded-md mr-2"
                            />
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                className="mb-4 px-4 py-2 border border-gray-300 rounded-md mr-2"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm New Password"
                                className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">
                            Change Password
                        </button>
                    </form>
                </div>
                {/* <div className="col-span-5 row-span-2 row-start-5 bg-gray-300 flex justify-center items-center">3</div> */}
            </div>
    );
};

export default UserManagement;