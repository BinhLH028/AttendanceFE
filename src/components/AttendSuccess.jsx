import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import useAuth from "./hooks/useAuth";
import { useParams } from 'react-router';
import { ClientJS } from 'clientjs';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { showSuccessMessage } from '../util/toastdisplay';

var stompClient = null;
const AttendSuccess = () => {
    const params = useParams()
    const client = new ClientJS();

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [isClickable, setIsClickable] = useState(false);

    const sendRq = () => {
        var c = client.getOS();
        var d = client.getOSVersion();
        var e = client.getPlugins();
        var f = client.getFonts();
        var g = client.getTimeZone();
        var h = client.getLanguage();
        var i = client.getBrowser();
        var z = Math.random() * 100;

        let msg = JSON.stringify({
            messageContent: auth.userData.userId + ":" + client.getCustomFingerprint(c, d, e, f, g, z) + ":" + auth.userData.email,
        });
        var mobilecheck = client.isMobile();
        // if(mobilecheck == true) {
        sendAttendRequest(params.email, msg);
        // } else {
        //     //TODO: please use mobile device
        // }
    }

    const handleClick = () => {
        // Disable the button
        setIsClickable(false);
        sendRq();
        // Enable the button after 2 seconds
        setTimeout(() => {
            setIsClickable(true);
        }, 2000);
    };


    useEffect(() => {
        connectSocket();
        sendRq();
        // Enable the button after 2 seconds
        const timer = setTimeout(() => {
            setIsClickable(true);
        }, 2000);

        // Clean up the timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    const sendAttendRequest = (email, msg) => {
        axiosPrivate.post("/send-private-message/" + email, msg).catch(error => { console.log(error) });
    }

    const connectSocket = () => {
        var socket = new SockJS('http://103.143.207.183:8082/our-websocket');
        stompClient = over(socket);
        var headers = {
            Authorization: 'Bearer ' + auth.accessToken,
        };
        stompClient.connect(headers, onConnected)
    }

    const onConnected = () => {
        stompClient.subscribe('/user/topic/private-messages', onAttendRqRecv);
    }

    const onAttendRqRecv = (payload) => {
        showSuccessMessage("Điểm danh thành công")
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            // Redirect to the main page after 2 seconds
            navigate(from, { replace: true });
        }, 2000);

        // Clear the timeout when the component unmounts or when the redirection occurs
        return () => clearTimeout(timeoutId);
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <p style={{ color: "white", fontSize: "50px" }}>Điểm danh thành công</p>
            <button 
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isClickable ? "" : "opacity-50 cursor-not-allowed"}`}
            onClick={handleClick} disabled={!isClickable}>Điểm danh</button>
            {!isClickable && (
                <p style={{ color: "white", fontSize: "16px" }}>Please wait...</p>
            )}
        </div>
    )
}

export default AttendSuccess