import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import httpClient from "../api/http-common";
import useAuth from "./hooks/useAuth";
import "./style.css";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { showSuccessMessage } from "../util/toastdisplay";
import { toast } from "react-toastify";
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Checkbox, Form, Input } from 'antd';

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

    const [form] = Form.useForm();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
        // console.log("1" +validName+ "2" +validPwd+"3"+validMatch + "4"+ isLogin);
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidName(USER_REGEX.test(user));
        if (!isLogin)
            setValidMatch(password === matchPwd);
        // console.log("1name" +validName+ "2pwd" +validPwd+"3match"+validMatch + "4"+ isLogin);

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
        let response;
        try {
            console.log(typeof loginData.email)
            response = await httpClient.post("/user/authenticate", loginData)
        }
        catch (error) {
            if (loginData.email == undefined || loginData.password == undefined) {
                toast.error('Hãy nhập đủ tài khoản và mật khẩu', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                toast.error('Sai tên đăng nhập hoặc mật khẩu', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }

        }
        if (response) {
            const accessToken = response.data.body.accessToken;
            const refreshToken = response.data.body.refreshToken;
            const userData = response.data.body.user;
            setAuth({ email, password, accessToken, refreshToken, userData });
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            if (response.status === 200)
                navigate(from, { replace: true });
        }

        // console.log(response);


    }

    const sendRegisterRequest = async (e) => {
        let registerData = JSON.stringify({
            username: user.trim().toLowerCase(),
            email: email,
            password: password,
            role: "TEACHER",
        });
        const response = await httpClient.post("/user/register", registerData)
        // console.log(response)
    }

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        localStorage.setItem("persist", true);
    }, [persist])

    return (
        <div className="login">
            <div class="container" id="container">
                <div class="form-container sign-up">
                    <Form
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="on"
                        form={form}
                    >
                        <h1>Tạo Tài Khoản</h1>
                        <span>Sử dụng email sinh viên của bạn</span>
                        <div className="w-full py-10 space-y-5">
                            <Form.Item
                                className="w-full"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Tên không được để trống và không chấp nhận số!',
                                        pattern: { USER_REGEX }
                                    },
                                ]}
                            >
                                <Input className="h-10" placeholder="Name" />
                            </Form.Item>

                            <Form.Item
                                className="w-full"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhap dung dinh dang email!',
                                        type: 'email'
                                    },
                                ]}
                            >
                                <Input className="h-10" placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                className="w-full"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password className="h-10" placeholder="Password" />
                            </Form.Item>

                            <Form.Item
                                className="w-full"
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'pls retype pass'
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The new password that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password className="h-10" placeholder="Confirm Password" />
                            </Form.Item>

                            <Form.Item className="flex items-center justify-center">
                                <Button
                                    className="h-10"
                                    id="submit"
                                    htmlType="submit"
                                    disabled={!form.isFieldsTouched(true) || form.getFieldError()
                                        .filter(({ errors }) => errors.length)
                                        .length > 0}
                                // onClick={(e) => sendRegisterRequest()}
                                >
                                    Đăng ký</Button>
                            </Form.Item>
                        </div>
                        {/* <input type="text" placeholder="Name"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                        {!validName && <p style={{ color: 'red' }}></p>}
                        <input type="email" placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="password" placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input type="password" placeholder="Re-Password"
                            value={matchPwd}
                            onChange={(e) => setMatchPwd(e.target.value)}
                        /> */}
                        {/* <button id="submit" type="button" disabled={form.getFieldError().filter(({ errors }) => errors.length)
                            .length > 0}
                            onClick={(e) => sendRegisterRequest()}>Đăng ký</button> */}
                    </Form>
                </div>
                <div class="form-container sign-in">
                    <form>
                        <h1>Đăng Nhập</h1>
                        <span>Sử dụng email sinh viên của bạn</span>
                        <input type="email" placeholder="Email" className="input_login"
                            id="email"
                            ref={userRef}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="password" placeholder="Password" className="input_login"
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
                            <button class="hide" id="login" onClick={onClickSignIn}>ĐĂNG NHẬP</button>
                        </div>
                        <div class="toggle-panel toggle-right">
                            <h1>Chưa Có Tài Khoản</h1>
                            <p>Đăng ký ngay với email sinh viên của bạn</p>
                            <button class="hide" id="register" onClick={onClickSignUp}>ĐĂNG KÝ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginComponent