import {
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaChartBar,
  FaCog
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>Tax Pay</h4>
        <small>Municipal System</small>
      </div>

      <ul className="menu">
        <li className={location.pathname === "/dashboard" ? "active" : ""}>
          <Link to="/dashboard" className="menu-link">
            <FaHome /> <span>Dashboard</span>
          </Link>
        </li>

        <li className={location.pathname === "/dashboard/users" ? "active" : ""}>
          <Link to="/dashboard/users" className="menu-link">
            <FaUsers /> <span>Tax Payers</span>
          </Link>
        </li>

        <li className={location.pathname === "/dashboard/payments" ? "active" : ""}>
          <Link to="/dashboard/Payments" className="menu-link">
            <FaMoneyBill /> <span>Payments</span>
          </Link>
        </li>

        {/*<li className={location.pathname === "/dashboard/reports" ? "active" : ""}>
          <Link to="/dashboard/reports" className="menu-link">
            <FaChartBar /> <span>Reports</span>
          </Link>
        </li>

        <li className={location.pathname === "/dashboard/settings" ? "active" : ""}>
          <Link to="/dashboard/settings" className="menu-link">
            <FaCog /> <span>Settings</span>
          </Link>
        </li>*/}
      </ul>
    </div>
  );
};

export default Sidebar;
