import axios from "axios"
import { logOutFailed, logOutStart, logOutSuccess, loginFailed, loginStart, loginSuccess } from "./authSlice"

export const loginUser = async (user, dispatch, navigate) => {
    console.log('Dispatching loginStart...');
    dispatch(loginStart());
    try {
        const res = await axios.post("http://localhost:8000/login", user);
        console.log('Dispatching loginSuccess...');
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (err) {
        console.error(err);
        console.log('Dispatching loginFailed...');
        dispatch(loginFailed());
    }
};

export const logOut = async(dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post("http://localhost:8000/logout", id, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(logOutSuccess())
    } catch (error) {
        dispatch(logOutFailed())
    }
}


