import React, { useEffect, useState, ReactElement, useRef } from 'react'
import { ClientJS } from 'clientjs';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { Select, } from "antd";
import { DataGrid } from '@mui/x-data-grid';
import "./../style/RightPanel.css";
import 'react-toastify/dist/ReactToastify.css';
import { showErrorMessage, showSuccessMessage } from '../util/toastdisplay';
import CustomPrompt from './PromtSave';

var stompClient = null;
const RightPanel = ({ selectedCourse, curCS, setOpenModal, setModalData, isShowTable, setListAttend }) => {

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

    const [isSessionCreated, setIsSessionCreated] = useState(false);

    const [isHaveData, setIsHaveData] = useState(false);

    const [showPrompt, setShowPrompt] = useState(false);
    const [onSaveData, setOnSaveData] = useState(new Map());

    let i = 1;

    const setUpData = async (selectedCourse) => {
        setData(selectedCourse)
        console.log(data)
        if (Array.isArray(selectedCourse)) {
            setIsHaveData(true)
        }

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
            col20: attendanceSheet.lectureOption1,
            col21: attendanceSheet.lectureOption2,
            col22: userId
        })));

        console.log(rows)

        setColumns([
            { field: 'id', headerName: 'STT', width: 70 },
            { field: 'col1', headerName: 'Mã SV', width: 150 },
            { field: 'col2', headerName: 'Họ và tên', width: 150 },
            { field: 'col3', headerName: 'Ngày sinh', width: 150 },
            { field: 'col4', headerName: 'Số buổi vắng', width: 150 },
            { field: 'col5', headerName: 'Buổi 1', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col6', headerName: 'Buổi 2', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col7', headerName: 'Buổi 3', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col8', headerName: 'Buổi 4', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col9', headerName: 'Buổi 5', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col10', headerName: 'Buổi 6', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col11', headerName: 'Buổi 7', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col12', headerName: 'Buổi 8', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col13', headerName: 'Buổi 9', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col14', headerName: 'Buổi 10', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col15', headerName: 'Buổi 11', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col16', headerName: 'Buổi 12', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col17', headerName: 'Buổi 13', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col18', headerName: 'Buổi 14', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col19', headerName: 'Buổi 15', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col20', headerName: 'Buổi 16', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col21', headerName: 'Buổi 17', width: 150, type: 'boolean', editable: ["TEACHER"].includes(auth.userData.role) },
            { field: 'col22', headerName: 'Attendance ID', width: 150, hide: true },
        ]);
    }

    useEffect(() => {
        setIsHaveData(false);
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
        if (!isSessionCreated) {
            setIsSessionCreated(true);
            setEdittedAttend([])
            try {
                const response = await axiosPrivate.post("/attendance?cs=" + curCS + "&lec=" + lecture);

                setModalData(auth.userData.email + "%2F" + curCS);
                setOpenModal(true);
                connectSocket();
                setAttenData(new Map());

                showSuccessMessage(`Tạo phiên điểm danh buổi thứ: ${lecture}`)

            } catch (error) {
                showErrorMessage(error)
            }
        } else {
            showErrorMessage("Đang có 1 phiên khác diễn ra hoặc chưa lưu phiên cũ")
        }
    }

    const connectSocket = () => {
        // https://attendance-8iks.onrender.com/
        // http://localhost:8080/
        var socket = new SockJS('http://103.143.207.183:8082/our-websocket');
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
        // console.log(payload);
        console.log(JSON.parse(payload.body).content);
        const msg = JSON.parse(payload.body).content.split(":");
        attenData.set(msg[1], parseInt(msg[0]))
        setAttenData(new Map(attenData));

        setTimeout(() => {
            axiosPrivate.post("/send-private-message/" + msg[2],
                JSON.stringify({
                    messageContent: "success"
                })
            ).catch(error => { console.log(error) });
        }, 0);


        onSaveData.set(msg[1], msg[2])
        setOnSaveData(new Map(onSaveData))
        // setListAttend(new Map(attenData));
    }

    const handleClickPropagation = (event) => {
        event.stopPropagation();
    }

    const handleSelectChange = (value) => {
        setLecture(value);
    }

    const saveAttendanceSession = async () => {
        if (isSessionCreated) {
            setShowPrompt(true);
            
            // setIsSessionCreated(false);
            // var attendSession = {
            //     lectureNum: parseInt(lecture),
            //     listStudentId: Array.from(attenData.values()),
            //     listEditUserAttends: editedAttend
            // }
            // let response;
            // try {
            //     response = await axiosPrivate.post("/attendance/save?cs=" + curCS, attendSession);
            //     showSuccessMessage('Lưu phiên điểm danh buổi thứ ' + lecture);
            // } catch (error) {
            //     showErrorMessage(error.response.data)
            // }
        } else
            showErrorMessage("Giảng viên chưa tạo phiên điểm danh !")
    }

    const handleConfirmSave = async () => {
        setShowPrompt(false);
        setIsSessionCreated(false);

        var attendSession = {
            lectureNum: parseInt(lecture),
            listStudentId: Array.from(attenData.values()),
            listEditUserAttends: editedAttend
        };

        try {
            const response = await axiosPrivate.post("/attendance/save?cs=" + curCS, attendSession);
            showSuccessMessage('Lưu phiên điểm danh buổi thứ ' + lecture);
            stompClient.disconnect();
        } catch (error) {
            showErrorMessage(error.response.data);
        }
    };

    // TODO: fix
    const onCellEditCommit = (params) => {
        if (isSessionCreated) {
            if (!editedAttend.includes(params.row.col22)) {
                const newEditedAttend = [...editedAttend, params.row.col22];
                setEdittedAttend(newEditedAttend)

                onSaveData.set(params.row.col22, params.row.col1 + "@vnu.edu.vn")
                setOnSaveData(new Map(onSaveData))
            }
        } else if (["TEACHER"].includes(auth.userData.role)) {
            showErrorMessage("Mọi thay đổi trước khi mở phiên đều không được lưu lại!")
        }
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
            <CustomPrompt
                isOpen={showPrompt}
                onClose={() => setShowPrompt(false)}
                onConfirm={handleConfirmSave}
                listAttend={onSaveData}
            />
            {(isShowTable === true && isHaveData) ? (
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
                            pageSizeOptions={[5, 10, 25, 50]}
                            columnVisibilityModel={{
                                col22: false,
                            }}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
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
                                    // justifyContent: "center",
                                    // position: "absolute",
                                    bottom: "50px",
                                    marginLeft: "4.5rem",
                                    marginTop: "1.5rem"
                                }}>
                                <div className='button'
                                    style={{
                                        backgroundColor: !isSessionCreated ? "rgb(92, 193, 226)" : "gray",
                                    }} onClick={() => createAttendanceSession()} >
                                    <span style={{
                                        fontFamily: "Aria",
                                        fontSize: "large"
                                    }}>Tạo Phiên Điểm Danh   </span>
                                    <Select style={{
                                        display: "inline-block",
                                        height: "35px",
                                        width: "4rem"
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
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                    </Select>
                                </div>
                                <div className='button'
                                    style={{
                                        fontFamily: "Aria",
                                        fontSize: "large",
                                        backgroundColor: isSessionCreated ? "rgb(92, 193, 226)" : "gray",
                                    }} onClick={() => saveAttendanceSession()}>
                                    <span>Lưu phiên</span>
                                </div>

                            </div>

                        )}
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center'>
                    <p style={{ color: "white", fontSize: "50px" }}>Chưa có dữ liệu học sinh</p>
                    <img
                        src="../src/resource/image.png"
                        style={{ width: "80rem", height: "50rem" }}
                    >
                    </img>
                </div>
            )}

        </div>
    )
}

export default RightPanel