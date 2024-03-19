import React from "react";
import { useState, useEffect } from "react";
import { Link, Route, Routes, useParams, useNavigate } from "react-router-dom"
import "./../style/LeftPanelStyle.css";
import LoadingScreen from './LoadingScreen';
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { PoweroffOutlined } from '@ant-design/icons';
import useLogout from "./hooks/useLogout";
import { showErrorMessage } from "../util/toastdisplay";
import { Menu } from "antd";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem('Thêm', 'sub1', undefined, [
        getItem(<Link to={'/course'}>Khóa học</Link>, '1'),
        getItem(<Link to={'/semester'}>Học kì</Link>, '2')
    ])
];

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

const Leftpanel = ({ listSemester, selectedSemester, setSelectedCourse, setCurSC, setIsShowTable }) => {

    var localCourseData = JSON.parse(window.localStorage.getItem("listCourse"));
    var localAttendanceData = JSON.parse(window.localStorage.getItem("attendanceData"));
    const axiosPrivate = useAxiosPrivate();

    const { auth, setAuth } = useAuth();
    const [onFirstLoad, setOnFirstLoad] = new useState(true);

    const [initData, setInitData] = useState([{}]);
    const [isLoading, setIsLoading] = useState(false);


    const [listCourse, setListCourse] = useState([{}]);

    const [openKeys, setOpenKeys] = useState([]);

    const temp = [];

    const params = useParams();
    const id = params.id;

    const navigate = useNavigate();

    useEffect(() => {
        listSemester.map(({ sectionId, semester, year }) => (
            temp.push({
                sectionId: sectionId,
                semester: semester,
                year: year,
            })
        ))
        setInitData(temp)

    }, [])

    const getListCourse = async (sectionId) => {
        let userRequest = JSON.stringify({
            userId: auth.userData.userId,
            role: auth.userData.role,
        });

        try {
            const response = await axiosPrivate.post("/course_section/" + sectionId, userRequest);

            const data = JSON.stringify(response.data.body);
            if (data != '{}') {
                window.localStorage.setItem('listCourse', data);
                localCourseData = JSON.parse(window.localStorage.getItem("listCourse"));
            }
            if (localCourseData != '{}') {
                await setListCourse(localCourseData);
                await setIsShowTable(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getCourseAttendanceData = async (id) => {
        try {
            const response = await axiosPrivate.get("/attendance?cs=" + id)
                .catch(error => { showErrorMessage(error) });
            const data = JSON.stringify(response.data.body);
            if (data != '{}') {
                window.localStorage.setItem('attendanceData', data);
                localAttendanceData = JSON.parse(window.localStorage.getItem("attendanceData"));
            }
            if (localAttendanceData != '{}') {
                await setSelectedCourse(localAttendanceData);
                await setIsShowTable(true);
                await setCurSC(id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (initData.length >= 1) {
            changeSemester(initData[0].sectionId
                , initData[0].semester, initData[0].year);
        }
    }, [initData])

    useEffect(() => {
        setIsLoading(false);
        // console.log(listCourse)
    }, [listCourse])

    const changeSemester = (sectionId, semester, year) => {
        var a = document.getElementById("semester");
        a.textContent = "Học Kỳ : " + semester + " Năm " + year
        if (sectionId != undefined) {
            getListCourse(sectionId);
            // console.log(sectionId + "--" + a.textContent)
        }
        console.log(auth?.accessToken);
    }

    const changeCourse = (id) => {
        // var a = document.getElementById("semester");
        // a.textContent = "Học Kỳ : " + semester + " Năm " + year
        if (id != undefined) {
            getCourseAttendanceData(id);
            // console.log(id)
        }
    }

    const logout = useLogout();

    if (isLoading) {
        return (<LoadingScreen />)
    }

    const handleLogout = () => {
        logout();
        localStorage.clear();
        navigate("/login", { replace: true });
    }

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const onClick = (e) => {

    }

    return (
        <div class="leftpanel"
            style={{
                // minHeight: "fill-available",
                // height: "-webkit-fill-available",
                // height: "1080px",
                width: "8rem",
                height: "100vh",
                display: "flex",
                position: "fixed",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "start",
                background: "linear-gradient(to bottom, rgb(0, 82, 212), rgb(67, 100, 247), rgb(111, 177, 252))",
                boxShadow: "3px 7px 10px rgba(0,0,0,.5)"
            }}>
            <div style={{ width: '100%' }}>
                <nav
                    style={{
                        width: "100%",
                    }}>
                    <ul>
                        <li class="dropdown">
                            <a id="semester" href="#">Học Kỳ</a>
                            <ul class="openright">
                                {listSemester !== null && listSemester.map(({ sectionId, semester, year }) => (
                                    <li key={sectionId}>
                                        <Link onClick={() => changeSemester(sectionId, semester, year)}>{semester} năm {year}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="#">Danh Sách Lớp Môn Học</a>
                            <ul class="openbottom">
                                {listCourse !== null && listCourse.map(({ id, courseCode, courseName }) => (
                                    <li key={id}>
                                        <Link
                                            to={{
                                                pathname: `/cs/${id}`,
                                            }}
                                            onClick={() => changeCourse(id)}>{courseCode}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </nav>

                <Menu
                    onClick={onClick}
                    mode="inline"
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    style={{
                        // width: 256,
                        backgroundColor: 'inherit',
                        color: 'white',
                        paddingTop: '5rem',
                        paddingLeft: '0'
                    }}
                    items={items}
                />
            </div>
            <div style={{ height: '5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PoweroffOutlined style={{ fontSize: '2rem', cursor: 'pointer' }} onClick={handleLogout} />
            </div>
        </div>
    )
}
export default Leftpanel