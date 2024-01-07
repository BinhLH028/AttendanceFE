import httpCommon from "../../api/http-common";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const { auth } = useAuth();

    const refresh = async () => {
        const response = await httpCommon.post('/user/refresh-token', {
            withCredentials: true,
        }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('refreshToken')}`
            }
        });
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            // console.log(response);
            // console.log(auth.accessToken);
            return { ...prev, userData: response.data.user, accessToken: response.data.accessToken, refreshToken: response.data.refreshToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;