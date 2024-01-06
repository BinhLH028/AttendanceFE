import React, { useEffect, useState, ReactElement } from 'react'
import { ClientJS } from 'clientjs';
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import Modal from './Modal';

import "./../style/RightPanel.css";


const RightPanel = ({ selectedCourse, curCS, setOpenModal }) => {

    const client = new ClientJS();

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const mapData = new Map();

    const [isFectch, setIsFetch] = new useState(true);

    const [data, setData] = new useState([])

    let i = 1;

    // const getData = (value) => {
    //     var result = Object.values(value)

    //     var myData = Object.keys(value).map(key => {
    //         return value[key];
    //     })

    //     {Object.entries(value).map(([key,val]) => (
    //         console.log( key + val)
    //     ))}

    //     const lecture1 = result.lecture1;
    //     const lecture2 = result.lecture2;
    //     const lecture3 = result.lecture3;
    //     const lecture4 = result.lecture4;
    //     const lecture5 = result.lecture5;
    //     const lecture6 = result.lecture6;
    //     const lecture7 = result.lecture7;
    //     const lecture8 = result.lecture8;
    //     const lecture9 = result.lecture9;
    //     const lecture10 = result.lecture10;
    //     const lecture11 = result.lecture11;
    //     const lecture12 = result.lecture12;
    //     const lecture13 = result.lecture13;
    //     const lecture14 = result.lecture14;
    //     const lecture15 = result.lecture15;


    //     // const listItems = numbers.map((number) =>
    //     //     <li key={number.toString()}>
    //     //     {number}
    //     //     </li>
    //     // );
    //     console.log(myData)

    //     const listItems = result.map((lecture1,lecture2,
    //         lecture3,
    //         lecture4,
    //         lecture5,
    //         lecture6,
    //         lecture7,
    //         lecture8,
    //         lecture9,
    //         lecture10,
    //         lecture11,
    //         lecture12,
    //         lecture13,
    //         lecture14,
    //         lecture15
    //         ) => 
    //         <div>
    //             <td>{lecture1}</td>
    //             <td>{lecture2}</td>
    //             <td>{lecture3}</td>
    //             <td>{lecture4}</td>
    //             <td>{lecture5}</td>
    //             <td>{lecture6}</td>
    //             <td>{lecture7}</td>
    //             <td>{lecture8}</td>
    //             <td>{lecture9}</td>
    //             <td>{lecture10}</td>
    //             <td>{lecture11}</td>
    //             <td>{lecture12}</td>
    //             <td>{lecture13}</td>
    //             <td>{lecture14}</td>
    //             <td>{lecture15}</td>
    //         </div>
    //         )
    //     return (listItems)
    // }

    const setUpData = (selectedCourse) => {
        // Object.keys(selectedCourse).forEach(function (key){
        //     mapData.set(key,selectedCourse[key]);
        // });
        // setData(Array.from(mapData, ([userid, value]) => ({ userid, value })));
        setData(selectedCourse)
    }

    useEffect(() => {
        if (selectedCourse != '{}' && selectedCourse != undefined) {
            setUpData(selectedCourse);
        }
        console.log(data)

    }, [selectedCourse])


    useEffect(() => {
        if (selectedCourse != '[]' && selectedCourse != undefined) {
            setIsFetch(false)
        }
    }, [data])

    const createAttendanceSession = async () => {
        const response = await axiosPrivate.post("/attendance?cs=" + curCS).catch(error => { console.log(error) });
        console.log(client.getFingerprint())
        setOpenModal(true);
        return (
            <div id = "abc"
            style={{
                width:"100%",
                height:"100%",
                backgroundColor:"beige",
                zIndex:"3"
            }}>

            </div>
        );
    }

    const checkAttendance = () => {

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
            
            <div class = "table">
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
                                        <td key={key}>{val ? 'có':'vắng'}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
                {/* && client.isMobile() */}
                {["USER"].includes(auth.userData.role)  &&
                (
                    <div className='btn_wrapper' 
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        position:"absolute",
                        bottom:"50px",
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
                            style={{}} onClick={() => createAttendanceSession()}>
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