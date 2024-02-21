import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import useAuth from "./hooks/useAuth";
import { useParams } from 'react-router';
import { ClientJS } from 'clientjs';


const AttendSuccess = () => {
    const params = useParams()
    const client = new ClientJS();

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    useEffect(() => {
        var c = client.getOS();
        var d = client.getOSVersion();
        var e = client.getPlugins();
        var f = client.getFonts();
        var g = client.getTimeZone();
        var h = client.getLanguage();
        var i = client.getBrowser();
        
        let msg = JSON.stringify({
            messageContent: auth.userData.userId + ":" + client.getCustomFingerprint(c, d, e, f, g),
        });
        var mobilecheck = client.isMobile();
        // if(mobilecheck == true) {
        sendAttendRequest(params.name, msg);
        // } else {
        //     //TODO: please use mobile device
        // }
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            // Redirect to the main page after 2 seconds
            navigate(from, { replace: true });
          }, 2000);
      
          // Clear the timeout when the component unmounts or when the redirection occurs
          return () => clearTimeout(timeoutId);

    }, []);

    const sendAttendRequest = (name, msg) => {
        axiosPrivate.post("/send-private-message/" + name, msg).catch(error => { console.log(error) });
    }

    return (
        <div>
            {isLoading && <div>Loading...</div>}
        </div>
    )
}

export default AttendSuccess