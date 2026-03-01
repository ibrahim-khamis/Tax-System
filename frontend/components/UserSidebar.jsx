import { useNavigate } from "react-router-dom";

const UserSidebar = ({ active, setActive, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // futa token
    navigate("/");// rudi login
  };

  return (
    <div className="user-sidebar">
      <h3>{userName}</h3>

      <ul>
        <li
          className={active === "status" ? "active" : ""}
          onClick={() => setActive("status")}
        >
          Status
        </li>

        <li
          className={active === "account" ? "active" : ""}
          onClick={() => setActive("account")}
        >
          My Account Info
        </li>

        <li
          className={active === "payments" ? "active" : ""}
          onClick={() => setActive("payments")}
        >
          Payment History
        </li>

        {/* HAPA NDIPO LOGOUT INAFANYIKA */}
        <li className="logout" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
