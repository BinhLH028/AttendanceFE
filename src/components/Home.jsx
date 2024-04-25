import React from "react";
import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Leftpanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import LoadingScreen from "./LoadingScreen";
import Modal from "./Modal";
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import "./../style/HomePanel.css";
import { showErrorMessage } from "../util/toastdisplay";

const Home = ({ children }) => {
  const { auth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isShowTable, setIsShowTable] = new useState(false);
  const [modalData, setModalData] = useState("");

  const [listSemester, setListSemester] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState();

  // if (listSemester[0] == null || listSemester[0] == undefined) {
  //   setSelectedSemester(listSemester[0])
  // }

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [curCS, setCurSC] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  var localSemesterData = JSON.parse(
    window.localStorage.getItem("listSemester")
  );

  const getListSemester = async () => {
    const response = await axiosPrivate.get("/section").catch((error) => {
      showErrorMessage(error);
    });
    const data = JSON.stringify(response.data.body);
    if (data != "{}") {
      window.localStorage.setItem("listSemester", data);
      localSemesterData = JSON.parse(
        window.localStorage.getItem("listSemester")
      );
    }
    if (localSemesterData != "{}") {
      await setListSemester(localSemesterData);
      await setSelectedSemester(localSemesterData[0]);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (["USER", "TEACHER"].includes(auth.userData.role)) getListSemester();
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [listSemester]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="HomePanel flex flex-col md:flex-row"
    >
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        modalData={modalData}
      />
      {/* <div class="bg-white border-gray-200 dark:bg-gray-900">
        <div
          className="flex justify-end md:hidden"
          style={{
            background:
              "linear-gradient(to left, rgb(0, 82, 212), rgb(67, 100, 247), rgb(111, 177, 252))",
            boxShadow: "3px 7px 10px rgba(0,0,0,.5)",
          }}
        >
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 
            rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 
            dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div className="" id="navbar-default"> */}
      <Leftpanel
        {...{
          listSemester,
          selectedSemester,
          setSelectedCourse,
          setCurSC,
          setIsShowTable,
        }}
      />
      {/* </div>
      </div> */}
      <Routes>
        <Route
          path="/cs/:id"
          render={(
            selectedCourse,
            curCS,
            setOpenModal,
            setModalData,
            isShowTable
          ) => (
            <RightPanel
              {...{
                selectedCourse,
                curCS,
                setOpenModal,
                setModalData,
                isShowTable,
              }}
            />
          )}
        />
      </Routes>
      {isShowTable === true ? (
        <RightPanel
          {...{
            selectedCourse,
            curCS,
            setOpenModal,
            setModalData,
            isShowTable,
          }}
        ></RightPanel>
      ) : (
        <div
          className="flex left-0 h-screen flex-col justify-end bg-transparent pt-[20px] pl-6 md:pl-6 md:w-full"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Home;
