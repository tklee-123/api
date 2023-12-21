import { useEffect } from "react";
import "./home.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const msg = useSelector((state) => state.users?.msg);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate, dispatch]);

  return (
    <main className="home-container">
      <div className="home-title">HOME</div>
      <div className="home-role">
        {`Your role: ${user?.role || 'unknown'}`}
      </div>
      <div className="home-userlist">
        {user?.role === 'student' ? (
          <div className="user-container">
            <div className="home-user">Đây là trang chủ dành cho sinh viên</div>
          </div>
        ) : user?.role === 'admin' ? (
          <div className="user-container">
            <div className="home-user">Đây là trang chủ dành cho quản trị viên</div>
          </div>
        ) : null}
      </div>
      {user?.role === 'admin' && <div>{msg}</div>}
    </main>
  );
};

export default HomePage;
