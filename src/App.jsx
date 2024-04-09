import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import RequireAuth from './components/RequiredAuth';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import Home from './components/Home';
import RightPanel from './components/RightPanel';
import AttendSuccess from './components/AttendSuccess';
import PersistLogin from './components/PersistLogin';
import AddCourse from './components/AddCourse';
import AddSemester from './components/AddSemester';

function App() {
  return (
    <div className="mainpage">
      <BrowserRouter>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path='/' element={<RequireAuth allowedRoles={["USER", "TEACHER", "ADMIN"]} />}>
              <Route index element={<Home />} />
              <Route path='attend-successfull/:name/*' index element={<AttendSuccess />}>
              </Route>
              <Route path='cs/:id/*' element={<Home />} />
              <Route path='course' element={<Home> <AddCourse/> </Home>} />
              <Route path='semester/*' element={<Home> <AddSemester/> </Home>} />
            </Route>
          </Route>

          <Route path='/login' element={<LoginComponent />}></Route>
          <Route path='/register' element={<RegisterComponent />}></Route>

        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
