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
import { showErrorMessage } from '../util/toastdisplay';

const Home = () => {
  const { auth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState("");

  const [listSemester, setListSemester] = useState([])
  const [selectedSemester, setSelectedSemester] = useState(listSemester[0])
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [curCS, setCurSC] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  var localSemesterData = JSON.parse(window.localStorage.getItem("listSemester"));

  const getListSemester = async () => {
    const response = await axiosPrivate.get("/section").catch(error => { showErrorMessage(error) });
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

  useEffect(() => {
    getListSemester();
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [listSemester])

  if (isLoading) {
    return (<LoadingScreen />)
  }

  return (
    <div className="HomePanel"
      style={{
        width: "100%",
        height: "100%",
      }}>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)} 
        modalData= {modalData}
        />
      <Leftpanel {...{ listSemester, selectedSemester, setSelectedCourse, setCurSC }} />
      <Routes>
        <Route path="/cs/:id" render={(selectedCourse, curCS, setOpenModal, setModalData) => <RightPanel {...{ selectedCourse, curCS, setOpenModal, setModalData }} />} />
      </Routes>
      <RightPanel {...{ selectedCourse, curCS, setOpenModal, setModalData }} />
    </div>
  )
}

export default Home