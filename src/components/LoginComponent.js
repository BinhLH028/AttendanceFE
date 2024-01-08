import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import httpClient from "../api/http-common";
import useAuth from "./hooks/useAuth";
import "./style.css";
import useRefreshToken from "./hooks/useRefreshToken";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import axios from "axios";


const USER_REGEX = /^[A-Za-z\s]{5,25}$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

const LoginComponent = () => {

    // const refresh = useRefreshToken();
    // const axiosPrivate = useAxiosPrivate(); 

    const { setAuth, persist, setPersist } = useAuth();

    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [matchPwd, setMatchPwd] = useState('');
    const [user, setUser] = useState('');

    const [isLogin, setIsLogin] = useState(true);
    const [validName, setValidName] = useState(false);
    const [validPwd, setValidPwd] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
        // console.log("1" +validName+ "2" +validPwd+"3"+validMatch + "4"+ isLogin);
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        if (!isLogin)
            setValidMatch(password === matchPwd);
    }, [password, matchPwd, isLogin])

    useEffect(() => {
        setErrMsg("");
    }, [email, password])



    const onClickSignUp = () => {
        setIsLogin(false);
        resetInputField();
        var container = document.getElementById('container');
        container.classList.add("active");
    }
    const onClickSignIn = () => {
        setIsLogin(true);
        resetInputField();
        var container = document.getElementById('container');
        container.classList.remove("active");
    }
    const resetInputField = () => {
        setEmail("");
        setPassword("");
        setMatchPwd("");
        setUser("");
    }

    const sendLoginRequest = async (e) => {
        let loginData = JSON.stringify({
            email: email,
            password: password,
        });
        const response = await httpClient.post("/user/authenticate", loginData)
        const accessToken = response.data.body.accessToken;
        const refreshToken = response.data.body.refreshToken;
        const userData = response.data.body.user;
        setAuth({ email, password, accessToken, refreshToken, userData });
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        // console.log(response);

        if (response.status === 200)
        navigate(from, { replace: true });
    }

    const sendRegisterRequest = async (e) => {
        let registerData = JSON.stringify({
            username: user.trim().toLowerCase(),
            email: email,
            password: password,
            role: "USER",
        });
        const response = await httpClient.post("/user/register", registerData)
        // console.log(response)
    }

    useEffect(() => {
        localStorage.setItem("persist", true);
    }, [persist])

    return (
        <div className="login">
            <div class="container" id="container">
                <div class="form-container sign-up">
                    <form>
                        <h1>Tạo Tài Khoản</h1>
                        <span>Sử dụng email sinh viên của bạn</span>
                        <input type="text" placeholder="Name" 
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                        <input type="email" placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="password" placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button id="submit" type="button" disabled={!validName || !validPwd || !validMatch ? true : false}
                        onClick={(e) => sendRegisterRequest()}>Đăng ký</button>
                    </form>
                </div>
                <div class="form-container sign-in">
                    <form>
                        <h1>Đăng Nhập</h1>
                        <span>Sử dụng email sinh viên của bạn</span>
                        <input type="email" placeholder="Email"
                            id="email"
                            ref={userRef}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="password" placeholder="Password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <a href="#">Quên mật khẩu?</a>
                        <button id="submit" type="button" onClick={(e) => sendLoginRequest()}>ĐĂNG NHẬP</button>
                    </form>
                </div>
                <div class="toggle-container">
                    <div class="toggle">
                        <div class="toggle-panel toggle-left">
                            <h1>Đã có tài khoản</h1>
                            <p>Đăng nhập để thực hiện điểm danh môn học</p>
                            <button class="hidden" id="login" onClick={onClickSignIn}>ĐĂNG NHẬP</button>
                        </div>
                        <div class="toggle-panel toggle-right">
                            <h1>Chưa Có Tài Khoản</h1>
                            <p>Đăng ký ngay với email sinh viên của bạn</p>
                            <button class="hidden" id="register" onClick={onClickSignUp}>ĐĂNG KÝ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginComponent