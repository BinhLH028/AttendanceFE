import React from 'react'
import { useEffect, useState } from 'react';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import useAuth from "./hooks/useAuth";
import { useParams } from 'react-router';
import { ClientJS } from 'clientjs';


const AttendSuccess = () => {
    const params = useParams()
    const client = new ClientJS();

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();


    useEffect(() => {
        var c = client.getOS();
        var d = client.getOSVersion();
        var e = client.getPlugins();
        var f = client.getFonts();
        var g = client.getTimeZone();
        var h = client.getLanguage();
        var i = client.getBrowser();
        let msg = JSON.stringify({
            messageContent: auth.userData.userId + ":" + client.getCustomFingerprint(c,d,e,f,g),
        });
        var mobilecheck = client.isMobile();
        // if(mobilecheck == true) {
            sendAttendRequest(params.name, msg);
        // } else {
        //     //TODO: please use mobile device
        // }

    }, []);

    const sendAttendRequest = (name, msg) => {
        axiosPrivate.post("/send-private-message/" + name, msg).catch(error => { console.log(error) });
    }

    return (
        <div>AttendSuccess</div>
    )
}

export default AttendSuccess