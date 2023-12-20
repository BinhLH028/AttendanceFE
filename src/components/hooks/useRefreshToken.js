import httpCommon from "../../api/http-common";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const { auth } = useAuth();
    // const accessToken = setAuth();

    const refresh = async () => {
        const response = await httpCommon.post('/user/refresh-token', {
            withCredentials: true,
        }, {
        headers: {
            "Authorization" : `Bearer ${auth.accessToken}`
        }});
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response);
            console.log(auth.accessToken);
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;