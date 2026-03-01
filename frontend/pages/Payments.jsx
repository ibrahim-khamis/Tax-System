import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import AdminLayout from "../layouts/AdminLayout";
import api from "../api/api";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("admin-business-status/");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      alert("Failed to load payments");
    }
  };

  return (
    <AdminLayout title="Payments">
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
          Payments
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Business</TableCell>
                <TableCell align="right">Amount (Tsh)</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((p, i) => (
                  <TableRow key={p.id} hover>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{p.user_first_name}</TableCell>
                    <TableCell>{p.user_last_name}</TableCell>
                    <TableCell>{p.business_name}</TableCell>
                    <TableCell align="right">{Number(p.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.status}
                        size="small"
                        color={p.status === "paid" ? "success" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
};

export default Payments;
