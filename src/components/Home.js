import React from 'react'
import { useEffect, useState } from 'react';
import { Link, Route, Routes } from "react-router-dom"
import Leftpanel from './LeftPanel'
import RightPanel from './RightPanel';
import LoadingScreen from './LoadingScreen';
import Modal from './Modal';
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from './hooks/useAxiosPrivate';
import "./../style/HomePanel.css";

const Home = () => {
  const { auth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [listSemester, setListSemester] = useState([])
  const [selectedSemester, setSelectedSemester] = useState(listSemester[0])
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [curCS, setCurSC] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  var localSemesterData = JSON.parse(window.localStorage.getItem("listSemester"));
  // var localCourseData = JSON.parse(window.localStorage.getItem("listCourse"));

  const getListSemester = async () => {
    const response = await axiosPrivate.get("/section").catch(error => { console.log(error) });
    const data = JSON.stringify(response.data.body);
    if (data != '{}') {
      window.localStorage.setItem('listSemester', data);
      localSemesterData = JSON.parse(window.localStorage.getItem("listSemester"));
    }
    if (localSemesterData != '{}') {
      await setListSemester(localSemesterData);
      await setSelectedSemester(localSemesterData[0]);
      setIsLoading(true);
    }
  }

  // const getListCourse = async () => {
  //   var userId = auth.userData.userId;
  //   // var role = 
  //   const response = await axiosPrivate.get("/course_section").catch(error => { console.log(error) });
  //   const data = JSON.stringify(response.data.body);
  //   if (data != '{}') {
  //     window.localStorage.setItem('listSemester', data);
  //     localCourseData = JSON.parse(window.localStorage.getItem("listSemester"));
  //   }
  //   if (localCourseData != '{}') {
  //     await setListCourse(localCourseData);
  //     setIsLoading(true);
  //   }
  // }

  useEffect(() => {
    getListSemester();
    // getListCourse();
  }, []);

  useEffect(() => {
    console.log(selectedSemester)
  }, [selectedSemester])

  useEffect(() => {
    setIsLoading(false);
    console.log(listSemester)
  }, [listSemester])

  if (isLoading) {
    return (<LoadingScreen />)
  }

  return (
    <div className="HomePanel"
      style={{
        // display: "flex",
        // flexWrap: "nowrap",
        // flexDirection: "row",
        width: "100%",
        height: "100%",
        // alignItems: "start",
      }}>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)} />
      <Leftpanel {...{ listSemester, selectedSemester, setSelectedCourse, setCurSC }} />
      <Routes>
        <Route path="/cs/:id" render={(selectedCourse, curCS, setOpenModal) => <RightPanel {...{ selectedCourse, curCS, setOpenModal }} />} />
        {/* <Route path="/cs/:id"  element={<RightPanel {...{selectedCourse, curCS, setOpenModal}}/>}></Route> */}
      </Routes>
      <RightPanel {...{ selectedCourse, curCS, setOpenModal }} />

    </div>
  )
}

export default Home