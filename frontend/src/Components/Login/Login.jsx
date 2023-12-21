import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
const Login = () => {
    const [username, setUsername] = useState("");
    const [pass, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Logging in...');
        const newUser = {
            _id: username,
            pass: pass
        };
        loginUser(newUser, dispatch, navigate);
    };
    return ( 
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit={handleLogin}>
                <label>USERNAME</label>
                <input type="text" placeholder="Enter your username" onChange={(e)=> setUsername(e.target.value)}/>
                <label>PASSWORD</label>
                <input type="password" placeholder="Enter your password" onChange={(e)=> setPassword(e.target.value)}/>
                <button type="submit"> Continue </button>
            </form>
        </section>
     );
}
 
export default Login;