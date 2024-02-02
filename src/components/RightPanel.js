import React, { useEffect, useState, ReactElement } from 'react'
import { ClientJS } from 'clientjs';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import Form from 'react-bootstrap/Form';
import Modal from './Modal';

import "./../style/RightPanel.css";
import { toast } from "react-toastify";
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var stompClient = null;
const BASE_URL = 'http://localhost:8080/';
const RightPanel = ({ selectedCourse, curCS, setOpenModal, setModalData, isShowTable }) => {

    const client = new ClientJS();

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [attenData, setAttenData] = useState(new Map());

    const [isFectch, setIsFetch] = new useState(true);

    const [data, setData] = new useState([]);
    const [lecture, setLecture] = new useState(1);



    let i = 1;
    let j = 1;


    const setUpData = (selectedCourse) => {
        setData(selectedCourse)
        console.log(data)

        var GridRowsProp = data.map(({ userId, userCode, userName, dob, attendanceSheet }) => ({
            id: j++,
            col1: userCode,
            col2: userName,
            col3: dob,
            col4: attendanceSheet.lecture1,
            col5: attendanceSheet.lecture2,
            col6: attendanceSheet.lecture3,
            col7: attendanceSheet.lecture4,
            col8: attendanceSheet.lecture5,
            col9: attendanceSheet.lecture6,
            col10: attendanceSheet.lecture7,
            col11: attendanceSheet.lecture8,
            col12: attendanceSheet.lecture9,
            col13: attendanceSheet.lecture10,
            col14: attendanceSheet.lecture11,
            col15: attendanceSheet.lecture12,
            col16: attendanceSheet.lecture13,
            col17: attendanceSheet.lecture14,
            col18: attendanceSheet.lecture15,
        }));

        console.log(GridRowsProp)
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
    }, [data])

    const createAttendanceSession = async () => {
        try {
            const response = await axiosPrivate.post("/attendance?cs=" + curCS);

            setModalData(auth.userData.userName);
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
            listStudentId: Array.from(attenData.values())
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
                    <div class="table">
                        <div class="table-wrapper" style={{ minWidth: '80%' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã SV</th>
                                        <th>Họ và tên</th>
                                        <th>Ngày sinh</th>
                                        <th>1</th>
                                        <th>2</th>
                                        <th>3</th>
                                        <th>4</th>
                                        <th>5</th>
                                        <th>6</th>
                                        <th>7</th>
                                        <th>8</th>
                                        <th>9</th>
                                        <th>10</th>
                                        <th>11</th>
                                        <th>12</th>
                                        <th>13</th>
                                        <th>14</th>
                                        <th>15</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(({ userId, userCode, userName, dob, attendanceSheet }) => (
                                        <tr key={userId}>
                                            <td>{i++}</td>
                                            <td>{userCode}</td>
                                            <td>{userName}</td>
                                            <td>{dob}</td>
                                            {Object.entries(attendanceSheet).map(([key, val]) => (
                                                <td key={key}>{val ? 'có' : 'vắng'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* && client.isMobile() */}
                    {["USER"].includes(auth.userData.role) &&
                        (
                            <div className='btn_wrapper'
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    position: "absolute",
                                    bottom: "50px",
                                    marginLeft: "4.5rem"
                                }}>
                                <div className='btn'
                                    style={{}} onClick={() => createAttendanceSession()}>
                                    <span>Tạo Phiên Điểm Danh   </span>
                                    <Form.Select aria-label="Default select example" onClick={(e) => handleClickPropagation(e)} onChange={handleSelectChange}>
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
                                <div className='btn'
                                    style={{}} onClick={() => createAttendanceSession()}>
                                    <span>Chỉnh Sửa</span>
                                </div>
                                <div className='btn'
                                    style={{}} onClick={() => saveAttendanceSession()}>
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

// {/* {["USER"].includes(auth.userData.role) && 
//                 (<div className='btn' 
//                     style={{position:"absolute",
//                     bottom:"50px"}} onClick={() => checkAttendance()}>
//                     <span>Điểm Danh</span>
//                 </div>)} */}
//             {/* <Modal 
//                 open={openModal} 
//                 onClose={() => setOpenModal(false)} /> */}