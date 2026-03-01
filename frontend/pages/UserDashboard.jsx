import { useState, useEffect } from "react";
import axios from "axios";
import UserSidebar from "../components/UserSidebar";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("status");
  const [showForm, setShowForm] = useState(false);

  const [user, setUser] = useState(null); // user info
  const [paymentDate, setPaymentDate] = useState(""); // new
  const [amount, setAmount] = useState(""); // new

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Fetch user + businesses + payments
  const fetchUser = async () => {
  if (!token || !userId) {
    navigate("/");
    return;
  }
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
      headers: { Authorization: `Token ${token}` },
    });
    setUser(res.data);  // res.data ina user + businesses + payments
  } catch (err) {
    console.error("Failed to fetch user data:", err);
    navigate("/");
  }
};

  useEffect(() => {
    fetchUser();
  }, [token, userId]);

  if (!user) return <p>Loading...</p>;

  const business = user.businesses?.[0];

  // Handle payment submission
  const handleSubmitPayment = async () => {
    if (!amount || !paymentDate) {
      alert("Please enter amount and payment date");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/",
        {
          business: business.id,
          amount: parseFloat(amount),
          payment_date: paymentDate,
          status: "paid",
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      alert("Payment successful!");
      setShowForm(false);
      setAmount("");
      setPaymentDate("");
      fetchUser(); // refresh payments
    } catch (err) {
  console.error("Payment failed:", err.response?.data);
  alert(JSON.stringify(err.response?.data));
}
  };

  return (
    <div className="user-layout">
      <UserSidebar
        active={active}
        setActive={setActive}
        userName={user.username}
        handleLogout={handleLogout}
      />

      <div className="user-content">
        {active === "status" && (
          <div className="card">
            <h3>Payment Status</h3>
            <p>
              <b>Business:</b> {business?.business_name}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span style={{ color: business?.status === "paid" ? "green" : "red" }}>
                {business?.status}
              </span>
            </p>
          </div>
        )}

        {active === "account" && (
          <div className="card">
            <h3>My Account Information</h3>
            <p>
              <b>Name:</b> {user.first_name} {user.last_name}
            </p>
            <p>
              <b>Business Name:</b> {business?.business_name}
            </p>
            <p>
              <b>Business Type:</b> {business?.business_type}
            </p>
            <p>
              <b>Address:</b> {user.address}
            </p>
          </div>
        )}

        {active === "payments" && (
          <>
            <div className="card">
              <h3>Payment History</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user?.payments?.length > 0 ? (
                    user.payments.map((p, i) => (
                      <tr key={i}>
                      <td>{p.date}</td>
                      <td>{Number(p.amount).toLocaleString()}</td>
                      <td style={{ color: p.status === "paid" ? "green" : "red" }}>
                  {p.status}
                      </td>
                  </tr>
                      ))
                    ) : (
                  <tr>
                      <td colSpan="3">No payments yet</td>
                  </tr>
                )}


                </tbody>
              </table>

              {!showForm && (
                <button className="btn" onClick={() => setShowForm(true)}>
                  Pay Now
                </button>
              )}
            </div>

            {showForm && (
              <div className="card">
                <h3>Payment Form</h3>
                <input value={business?.business_name} readOnly />
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div>
                  <button className="btn" onClick={handleSubmitPayment}>
                    Submit
                  </button>
                  <button className="btn cancel" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
