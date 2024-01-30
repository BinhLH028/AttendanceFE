import React, { useEffect, useState, ReactElement } from 'react'
import { ClientJS } from 'clientjs';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import Modal from './Modal';

import "./../style/RightPanel.css";
import { showErrorMessage } from '../util/toastdisplay';

var stompClient = null;
const BASE_URL = 'http://localhost:8080/';
const RightPanel = ({ selectedCourse, curCS, setOpenModal, setModalData }) => {

    const client = new ClientJS();

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [privateChats, setPrivateChats] = useState(new Map());     

    const [isFectch, setIsFetch] = new useState(true);

    const [data, setData] = new useState([])

    let i = 1;


    const setUpData = (selectedCourse) => {
        setData(selectedCourse)
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
        const response = await axiosPrivate.post("/attendance?cs=" + curCS).catch(error => { console.log(error) });
        setModalData(auth.userData.userName);
        setOpenModal(true);
        connectSocket();

        return (
            <div id="abc"
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "beige",
                    zIndex: "3"
                }}>

            </div>
        );
    }

    const connectSocket = () => {
        var socket = new SockJS('http://localhost:8080/our-websocket');
        stompClient = over(socket);
        var headers = {
            Authorization : 'Bearer ' + auth.accessToken,
        };
        stompClient.connect(headers, onConnected)
    }

    const onConnected = () => {
        stompClient.subscribe('/user/topic/private-messages', onAttendRqRecv);
    }

    const onAttendRqRecv = (payload) =>{
        console.log(payload);
        console.log(JSON.parse(payload.body).content);
    }
    // function showMessage(message) {
    //     $("#messages").append("<tr><td>" + message + "</td></tr>");
    // };

    const saveAttendanceSession = () => {

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
                                    {/* {getData(value)} */}
                                    {/* {Object.} */}
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
                            <span>Tạo Phiên Điểm Danh</span>
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
            {/* {["USER"].includes(auth.userData.role) && 
                (<div className='btn' 
                    style={{position:"absolute",
                    bottom:"50px"}} onClick={() => checkAttendance()}>
                    <span>Điểm Danh</span>
                </div>)} */}
            {/* <Modal 
                open={openModal} 
                onClose={() => setOpenModal(false)} /> */}
        </div>
    )
}

export default RightPanel