import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // futa token
    localStorage.removeItem("token");

    // rudi login page
    navigate("/");
  };

  return (
    <div className="header">
      <h5>Municipal Tax Pay System</h5>

      <div className="header-user">
        <span>Admin User</span>
        <button
          className="btn btn-sm btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
