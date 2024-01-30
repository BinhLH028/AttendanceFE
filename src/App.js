import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
      <BrowserRouter>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path='/' element={<RequireAuth allowedRoles={["USER", "TEACHER"]} />}>
              <Route index element={<Home />}>
                {/* <Route path='/abc'  element={<RightPanel/>}/> */}
              </Route>

              <Route path='attend-successfull/:name' index element={<AttendSuccess />}>
              </Route>

              <Route path='cs/:id'>
                <Route index element={<Home />} />
              </Route>
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
