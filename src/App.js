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

function App() {
  return (
    <div className="mainpage">
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
      {/* Same as */}
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path='/' element={<RequireAuth allowedRoles={["USER", "TEACHER"]} />}>
              <Route index element={<Home />} />
              <Route path='attend-successfull/:name' index element={<AttendSuccess />}>
              </Route>
              <Route path='cs/:id' element={<Home />} />
            </Route>
          </Route>

          <Route path='/login' element={<LoginComponent />}></Route>
          <Route path='/register' element={<RegisterComponent />}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
