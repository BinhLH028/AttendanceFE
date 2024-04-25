import React from "react";
import { useState, useEffect } from "react";
import { Link, Route, Routes, useParams, useNavigate } from "react-router-dom";
import "./../style/LeftPanelStyle.css";
import LoadingScreen from "./LoadingScreen";
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import useLogout from "./hooks/useLogout";
import { showErrorMessage } from "../util/toastdisplay";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

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
  getItem("QUẢN LÝ", "sub1", undefined, [
    getItem(
      <Link
        style={{
          fontFamily: "Arial",
          fontSize: "medium",
          textDecoration: "none",
        }}
        to={"/course"}
      >
        Khóa học
      </Link>,
      "1"
    ),

    getItem(
      <Link
        style={{
          fontFamily: "Arial",
          fontSize: "medium",
          textDecoration: "none",
        }}
        to={"/semester"}
      >
        LMH
      </Link>,
      "2"
    ),
    getItem(
      <Link
        style={{
          fontFamily: "Arial",
          fontSize: "medium",
          textDecoration: "none",
        }}
        to={"/manage"}
      >
        Manage
      </Link>,
      "3"
    ),
  ]),
];

const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

const rootOptionsSubmenuKeys = ["sub1", "sub2", "sub4"];

const Leftpanel = ({
  listSemester,
  selectedSemester,
  setSelectedCourse,
  setCurSC,
  setIsShowTable,
}) => {
  var localCourseData = JSON.parse(window.localStorage.getItem("listCourse"));
  var localAttendanceData = JSON.parse(
    window.localStorage.getItem("attendanceData")
  );
  const axiosPrivate = useAxiosPrivate();

  const { auth, setAuth } = useAuth();
  const [onFirstLoad, setOnFirstLoad] = new useState(true);

  const [initData, setInitData] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);

  const [listCourse, setListCourse] = useState([{}]);

  const [openKeys, setOpenKeys] = useState([]);

  const [optionOpenKeys, setOptionOpenKeys] = useState([]);

  const temp = [];

  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  useEffect(() => {
    listSemester.map(({ sectionId, semester, year }) =>
      temp.push({
        sectionId: sectionId,
        semester: semester,
        year: year,
      })
    );
    setInitData(temp);
  }, []);

  const getListCourse = async (sectionId) => {
    let userRequest = JSON.stringify({
      userId: auth.userData.userId,
      role: auth.userData.role,
    });

    try {
      const response = await axiosPrivate.post(
        "/course_section/" + sectionId,
        userRequest
      );

      const data = JSON.stringify(response.data.body);
      if (data != "{}") {
        window.localStorage.setItem("listCourse", data);
        localCourseData = JSON.parse(window.localStorage.getItem("listCourse"));
      }
      if (localCourseData != "{}") {
        await setListCourse(localCourseData);
        await setIsShowTable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCourseAttendanceData = async (id) => {
    try {
      const response = await axiosPrivate
        .get("/attendance?cs=" + id)
        .catch((error) => {
          showErrorMessage(error);
        });
      const data = JSON.stringify(response.data.body);
      if (data != "{}") {
        window.localStorage.setItem("attendanceData", data);
        localAttendanceData = JSON.parse(
          window.localStorage.getItem("attendanceData")
        );
      }
      if (localAttendanceData != "{}") {
        await setSelectedCourse(localAttendanceData);
        await setIsShowTable(true);
        await setCurSC(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (initData.length >= 1 && ["USER"].includes(auth.userData.role)) {
      changeSemester(
        initData[0].sectionId,
        initData[0].semester,
        initData[0].year
      );
    }
  }, [initData]);

  useEffect(() => {
    setIsLoading(false);
  }, [listCourse]);

  const changeSemester = (sectionId, semester, year) => {
    var a = document.getElementById("semester");
    a.textContent = "Học Kỳ : " + semester + " Năm " + year;
    if (sectionId != undefined) {
      getListCourse(sectionId);
    }
    console.log(auth?.accessToken);
  };

  const changeCourse = (id) => {
    if (id != undefined) {
      getCourseAttendanceData(id);
    }
  };

  const logout = useLogout();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleUserManagement = () => {
    navigate("/user-management", { replace: true });
  };

  const optionMenuitems = [
    getItem("SETTING", "sub1", undefined, [
      getItem(
        <UserOutlined
          style={{
            height: "5rem",
            width: "100%",
            fontSize: "2rem",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleUserManagement}
        />,
        "1"
      ),

      getItem(
        <PoweroffOutlined
          style={{
            height: "5rem",
            width: "100%",
            fontSize: "2rem",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        />,
        "2"
      ),
    ]),
  ];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onOptionsOpenChange = (keys) => {
    const latestOpenKey = keys.find(
      (key) => optionOpenKeys.indexOf(key) === -1
    );
    if (latestOpenKey && rootOptionsSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOptionOpenKeys(keys);
    } else {
      setOptionOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onClick = (e) => {};

  return (
    <div
      className="leftpanel flex sticky flex-row justify-between items-start w-full overflow-auto md:min-w-32 md:w-32 md:h-screen md:flex-col"
      style={{
        background:
          "linear-gradient(to bottom, rgb(0, 82, 212), rgb(67, 100, 247), rgb(111, 177, 252))",
        boxShadow: "3px 7px 10px rgba(0,0,0,.5)",
      }}
    >
      {(["USER"].includes(auth.userData.role) ||
        ["TEACHER"].includes(auth.userData.role)) && (
        <nav
          style={{
            width: "100%",
          }}
        >
          <ul>
            <li class="dropdown">
              <a id="semester" href="#">
                Học Kỳ
              </a>
              <ul class="openright">
                {listSemester !== null &&
                  listSemester.map(({ sectionId, semester, year }) => (
                    <li key={sectionId}>
                      <Link
                        onClick={() =>
                          changeSemester(sectionId, semester, year)
                        }
                      >
                        {semester} năm {year}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            <li class="dropdown">
              <a href="#">Danh Sách Lớp Môn Học</a>
              <ul class="openbottom">
                {listCourse !== null &&
                  listCourse.map(({ id, courseCode, courseName }) => (
                    <li key={id}>
                      <Link
                        to={{
                          pathname: `/cs/${id}`,
                        }}
                        onClick={() => changeCourse(id)}
                      >
                        {courseCode}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          </ul>
        </nav>
      )}

      {["ADMIN"].includes(auth.userData.role) && (
        <div className="flex justify-start w-full h-min pl-2 md:flex-col md:justify-between md:h-screen md:p-0">
          <div>
            <Menu
              mode="inline"
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              style={{
                // width: 256,
                fontFamily: "Arial",
                fontSize: "medium",
                textDecoration: "none",

                backgroundColor: "inherit",
                color: "white",
                paddingTop: "0",
                paddingLeft: "0",
              }}
              items={items}
            />
          </div>
          <div className="pb-8">
            {/* <div className="flex flex-col h-20 w-full md:h-40 md:hidden"> */}
            <Menu
              mode="inline"
              optionOpenKeys={optionOpenKeys}
              onOpenChange={onOptionsOpenChange}
              style={{
                // width: 256,
                fontFamily: "Arial",
                fontSize: "medium",
                textDecoration: "none",

                backgroundColor: "inherit",
                color: "white",
                paddingTop: "0",
                paddingLeft: "0",
              }}
              items={optionMenuitems}
            />
          </div>

          {/* <div className="hidden items-center justify-center flex-col h-20 w-full md:flex space-y-10 pb-10">
                <UserOutlined
                  style={{
                    height: "5rem",
                    width: "100%",
                    fontSize: "2rem",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleUserManagement}
                />
                <PoweroffOutlined
                  style={{
                    height: "5rem",
                    width: "100%",
                    fontSize: "2rem",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleLogout}
                />
              </div>
            </div> */}
        </div>
      )}
      {/* </div> */}
    </div>
  );
};
export default Leftpanel;
