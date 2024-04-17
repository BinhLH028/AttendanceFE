import React, { useEffect, useState, ReactElement, useRef } from 'react'
import { ClientJS } from 'clientjs';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import Form from 'react-bootstrap/Form';
import Modal from './Modal';
import { DataGrid } from '@mui/x-data-grid';

import "./../style/RightPanel.css";
import { toast } from "react-toastify";
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var stompClient = null;
const RightPanel = ({ selectedCourse, curCS, setOpenModal, setModalData, isShowTable }) => {

    const client = new ClientJS();

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [attenData, setAttenData] = useState(new Map());

    const [isFectch, setIsFetch] = new useState(true);

    const [data, setData] = new useState([]);
    const [lecture, setLecture] = new useState(1);

    const [rows, setRows] = new useState([]);
    const [columns, setColumns] = new useState([]);
    const [editedAttend, setEdittedAttend] = new useState([]);

    let i = 1;

    const setUpData = async (selectedCourse) => {
        setData(selectedCourse)
        console.log(data)

        await setRows(selectedCourse.map(({ userId, userCode, userName, dob, sheetId, attendanceSheet }) => ({
            id: i++,
            col1: userCode,
            col2: userName,
            col3: dob,
            col4: attendanceSheet.totalAbsence,
            col5: attendanceSheet.lecture1,
            col6: attendanceSheet.lecture2,
            col7: attendanceSheet.lecture3,
            col8: attendanceSheet.lecture4,
            col9: attendanceSheet.lecture5,
            col10: attendanceSheet.lecture6,
            col11: attendanceSheet.lecture7,
            col12: attendanceSheet.lecture8,
            col13: attendanceSheet.lecture9,
            col14: attendanceSheet.lecture10,
            col15: attendanceSheet.lecture11,
            col16: attendanceSheet.lecture12,
            col17: attendanceSheet.lecture13,
            col18: attendanceSheet.lecture14,
            col19: attendanceSheet.lecture15,
            col20: userId
        })));

        console.log(rows)

        setColumns([
            { field: 'col1', headerName: 'Mã SV', width: 150 },
            { field: 'col2', headerName: 'Họ và tên', width: 150 },
            { field: 'col3', headerName: 'Ngày sinh', width: 150 },
            { field: 'col4', headerName: 'Số buổi vắng', width: 150},
            { field: 'col5', headerName: 'Buổi 1', width: 150, type: 'boolean', editable: true },
            { field: 'col6', headerName: 'Buổi 2', width: 150, type: 'boolean', editable: true },
            { field: 'col7', headerName: 'Buổi 3', width: 150, type: 'boolean', editable: true },
            { field: 'col8', headerName: 'Buổi 4', width: 150, type: 'boolean', editable: true },
            { field: 'col9', headerName: 'Buổi 5', width: 150, type: 'boolean', editable: true },
            { field: 'col10', headerName: 'Buổi 6', width: 150, type: 'boolean', editable: true },
            { field: 'col11', headerName: 'Buổi 7', width: 150, type: 'boolean', editable: true },
            { field: 'col12', headerName: 'Buổi 8', width: 150, type: 'boolean', editable: true },
            { field: 'col13', headerName: 'Buổi 9', width: 150, type: 'boolean', editable: true },
            { field: 'col14', headerName: 'Buổi 10', width: 150, type: 'boolean', editable: true },
            { field: 'col15', headerName: 'Buổi 11', width: 150, type: 'boolean', editable: true },
            { field: 'col16', headerName: 'Buổi 12', width: 150, type: 'boolean', editable: true },
            { field: 'col17', headerName: 'Buổi 13', width: 150, type: 'boolean', editable: true },
            { field: 'col18', headerName: 'Buổi 14', width: 150, type: 'boolean', editable: true },
            { field: 'col19', headerName: 'Buổi 15', width: 150, type: 'boolean', editable: true },
            { field: 'col20', headerName: 'Attendance ID', width: 150, hide: true },
        ]);
    }

    useEffect(() => {
        if (selectedCourse != '{}' && selectedCourse != undefined) {
            setUpData(selectedCourse);
        }
    }, [selectedCourse])


    useEffect(() => {
        if (selectedCourse != '[]' && selectedCourse != undefined) {
            setIsFetch(false)
        }
    }, [data, rows])

    const createAttendanceSession = async () => {
        try {
            const response = await axiosPrivate.post("/attendance?cs=" + curCS + "&lec=" + lecture);

            setModalData(auth.userData.email + "%2F" + curCS);
            setOpenModal(true);
            connectSocket();
            setAttenData(new Map());

            toast.success(`Tạo phiên điểm danh buổi thứ: ${lecture}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            // reset edit array when create new session
            arrayEditAttend.length = 0;
        } catch (error) {
            toast.success(`Error : ${error}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }

    const connectSocket = () => {
        // https://attendance-8iks.onrender.com/
        // http://localhost:8080/
        var socket = new SockJS('http://localhost:8080/our-websocket');
        stompClient = over(socket);
        var headers = {
            Authorization: 'Bearer ' + auth.accessToken,
        };
        stompClient.connect(headers, onConnected)
    }

    const onConnected = () => {
        stompClient.subscribe('/user/topic/private-messages', onAttendRqRecv);
    }

    const onAttendRqRecv = (payload) => {
        console.log(payload);
        console.log(JSON.parse(payload.body).content);
        const msg = JSON.parse(payload.body).content.split(":");
        attenData.set(msg[1], parseInt(msg[0]))
        setAttenData(new Map(attenData));
        for (let [key, value] of attenData) {
            console.log(key + " : " + value);
        }

    }

    const handleClickPropagation = (event) => {
        event.stopPropagation();
    }

    const handleSelectChange = (event) => {
        setLecture(event.target.value);

        console.log(lecture)
    }

    const saveAttendanceSession = async () => {
        var attendSession = {
            lectureNum: parseInt(lecture),
            listStudentId: Array.from(attenData.values()),
            listEditUserAttends: editedAttend
        }
        let response;
        try {
            response = await axiosPrivate.post("/attendance/save?cs=" + curCS, attendSession);

            toast.success(`Lưu phiên điểm danh buổi thứ: ${lecture}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            toast.error(`Lỗi: ${error.response.data}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }
    // TODO: fix
    const onCellEditCommit = (params) => {
        if (!editedAttend.includes(params.row.col20)) {
            const newEditedAttend = [...editedAttend, params.row.col20];
            setEdittedAttend(newEditedAttend)
        }
        console.log("binh+" + editedAttend);
    };

    if (isFectch) return (
        <div>dang load</div>
    )

    return (
        <div class="RightPanel" style={{
            height: "100vh",
            // width: "120rem",
            display: "flex",
            left: "0",
            // flex: "0 0 87%",
            flexDirection: "column",
            justifyContent: "right",
            alignItems: "",
            background: "transparent",
            padding: "20px 0 0 10rem"
        }}>
            {(isShowTable === true) ? (
                <div>
                    <div style={{
                        height: "auto",
                        width: '98%',
                        backgroundColor: 'rgba(230, 230, 230, 0.5)',
                        border: 'solid lightgray 1px'
                    }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSizeOptions={[]}
                            columnVisibilityModel={{
                                col20: false,
                            }}
                            onCellEditStop={onCellEditCommit} />
                    </div>

                    {/* && client.isMobile() */}
                    {["TEACHER"].includes(auth.userData.role) &&
                        (
                            <div className='button_wrapper'
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    position: "absolute",
                                    bottom: "50px",
                                    marginLeft: "4.5rem"
                                }}>
                                <div className='button'
                                    style={{}} onClick={() => createAttendanceSession()}>
                                    <span style={{
                                        fontFamily:"Aria",
                                        fontSize:"large"
                                    }}>Tạo Phiên Điểm Danh   </span>
                                    <Form.Select style={{
                                        display:"inline-block",
                                        height:"35px"
                                    }} 
                                        aria-label="Default select example" onClick={(e) => handleClickPropagation(e)} onChange={handleSelectChange}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                    </Form.Select>
                                </div>
                                <div className='button'
                                    style={{
                                        fontFamily:"Aria",
                                        fontSize:"large"
                                    }} onClick={() => createAttendanceSession()}>
                                    <span>Chỉnh Sửa</span>
                                </div>
                                <div className='button'
                                    style={{
                                        fontFamily:"Aria",
                                        fontSize:"large"
                                    }} onClick={() => saveAttendanceSession()}>
                                    <span>Lưu phiên</span>
                                </div>
                            </div>
                        )}
                </div>
            ) : (<div></div>)}

        </div>
    )
}

export default RightPanel