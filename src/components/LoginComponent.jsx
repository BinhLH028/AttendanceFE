import React, { useEffect, useRef } from "react";
import { Form, Input, Button, message } from 'antd';
import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import httpClient from "../api/http-common";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useAuth from "./hooks/useAuth";
import "./style.css";
import { showErrorMessage, showSuccessMessage } from '../util/toastdisplay';
import 'react-toastify/dist/ReactToastify.css';


const USER_REGEX = /^[A-Za-z\s]{5,25}$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

const LoginComponent = () => {

    const axiosPrivate = useAxiosPrivate();

    const [formLogin] = Form.useForm();
    const [formRegister] = Form.useForm();

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
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, [])

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
            email: e.email,
            password: e.password,
        });
        console.log(loginData);
        let response;
        try {
            response = await httpClient.post("/user/authenticate", loginData)
        }
        catch (error) {
            if (loginData.email == undefined || loginData.password == undefined) {
                showErrorMessage('Sai tên đăng nhập hoặc mật khẩu')
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
        let response;
        try {
            response = await httpClient.post("/user/register", registerData);
            if (response.data.statusCodeValue == 200) {
                showSuccessMessage('Tạo tài khoản thành công')
                formRegister.resetFields();
                setUser('');
                setEmail('');
                setPassword('');
                setMatchPwd('');
            }
            else if (response.data.statusCodeValue == 400) {
                showErrorMessage(response.data.body[0])
            }
        }
        catch (error) {
            showErrorMessage('Có lỗi xảy ra, xin vui lòng thử lại sau!')
        }
    }

    const onFinish = (values) => {
        if (values.email && values.password) {
            // If both email and password are provided, perform login logic
            sendLoginRequest(values);
        } else {
            // Display error message if either email or password is missing
            message.error('Please enter both email and password');
        }
    };

    const onFinishRegister = () => {
        if (!user || !email || !password || !matchPwd) {
            message.error('Please fill in all fields');
            return;
        }

        if (password !== matchPwd) {
            showErrorMessage('Mật khẩu không trùng khớp');
            return;
        }

        // Send register request
        sendRegisterRequest();
    };

    const handleBackToLogin = () => {
        setIsForgotPassword(false);
    };

    const handleForgotPasswordClick = () => {
        setIsForgotPassword(true);
    };

    useEffect(() => {
        localStorage.setItem("persist", true);
    }, [persist])

    const handleForgotPassword = (value) => {
        console.log(value);
    };

    const renderForgotPasswordForm = () => {
        return (
            <Form onFinish={handleForgotPassword}>
                <h1>Quên Mật Khẩu</h1>
                <Form.Item name="email" rules={[{ required: true, message: 'Please input your email' }]}
                style={{ width: "80%" }}
                >
                    <Input
                        type="email"
                        placeholder="Email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button onClick={handleBackToLogin}
                    style={{ height: "80%",margin:"1rem" }}
                    >Quay lại</Button>
                    <Button type="primary" htmlType="submit"
                    style={{ height: "80%",margin:"1rem" }}>
                        Gửi Email
                    </Button>
                </Form.Item>
            </Form>
        );
    };

    return (
        <div className="login">
            <div class="container" id="container">
                <div class="form-container sign-up">
                    <Form onFinish={onFinishRegister}
                        form={formRegister}
                    >
                        <h1>Tạo Tài Khoản</h1>
                        <span>Sử dụng email sinh viên của bạn</span>
                        <Form.Item name="name" rules={[{ required: true, message: 'Please input your name' }]}
                            style={{ width: "80%" }}>
                            <Input
                                type="text"
                                placeholder="Name"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email' }]}
                            style={{ width: "80%" }}>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item name="password"
                            rules={[
                                { required: true, message: 'Please input your password' },
                                { min: 8, message: 'Password must be at least 8 characters' },
                                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' }
                            ]}
                            style={{ width: "80%" }}>
                            <Input.Password
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item name="matchPwd" rules={[{ required: true, message: 'Please re-enter your password' }]}
                            style={{ width: "80%" }}>
                            <Input.Password
                                placeholder="Re-Password"
                                value={matchPwd}
                                onChange={(e) => setMatchPwd(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit"
                                style={{ height: "100%" }}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div class="form-container sign-in">
                    {isForgotPassword && renderForgotPasswordForm()}
                    {!isForgotPassword &&
                        <Form form={formLogin} onFinish={onFinish}>
                            <h1>Đăng Nhập</h1>
                            <span>Sử dụng email sinh viên của bạn</span>
                            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email' }]}
                                style={{ width: "80%" }}
                            >
                                <Input placeholder="Email" ref={userRef} />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password' }]}
                                style={{ width: "80%" }}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <a onClick={handleForgotPasswordClick}>Quên mật khẩu?</a>
                            <Form.Item>
                                <Button type="primary" htmlType="submit"
                                    style={{ height: "100%" }}>
                                    ĐĂNG NHẬP
                                </Button>
                            </Form.Item>
                        </Form>
                    }
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