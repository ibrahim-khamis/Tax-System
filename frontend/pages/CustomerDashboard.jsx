import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import CustomerLayout from "../layouts/CustomerLayout";

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchUser = async () => {
    if (!token || !userId) {
      window.location.href = "/";
      return;
    }
    try {
      const res = await axios.get("https://tax-system-a4we.onrender.com/api/profile/", {
        headers: { Authorization: `Token ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token, userId]);

  const handleSubmitPayment = async () => {
    if (!amount || !paymentDate) {
      setPaymentError("Please enter amount and payment date");
      return;
    }

    const business = user?.businesses?.[0];
    if (!business) {
      setPaymentError("No business found");
      return;
    }

    setSubmitting(true);
    setPaymentError("");

    try {
      await axios.post(
        "https://tax-system-a4we.onrender.com/api/payments/",
        {
          business: business.id,
          amount: parseFloat(amount),
          payment_date: paymentDate,
          status: "paid",
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      setPaymentFormOpen(false);
      setAmount("");
      setPaymentDate("");
      fetchUser(); // refresh payments
    } catch (err) {
      console.error("Payment failed:", err.response?.data);
      setPaymentError(
        err.response?.data?.detail || "Payment failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <CustomerLayout title="Customer Dashboard">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout title="Customer Dashboard">
        <Alert severity="error">{error}</Alert>
      </CustomerLayout>
    );
  }

  const business = user?.businesses?.[0];

  return (
    <CustomerLayout title="Customer Dashboard">
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Status Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Status
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Business:</strong> {business?.business_name}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong>{" "}
              <Chip
                label={business?.status || "Unknown"}
                color={business?.status === "paid" ? "success" : "error"}
                size="small"
              />
            </Typography>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Account Information
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Business Name:</strong> {business?.business_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Business Type:</strong> {business?.business_type}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {user.address}
            </Typography>
          </CardContent>
        </Card>

        {/* Payment History Card */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Payment History</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setPaymentFormOpen(true)}
              >
                Add Payment
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user?.payments?.length > 0 ? (
                    user.payments.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          TZS {Number(payment.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            color={payment.status === "paid" ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No payments yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Payment Form Dialog */}
        <Dialog open={paymentFormOpen} onClose={() => setPaymentFormOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogContent>
            {paymentError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {paymentError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Business Name"
              value={business?.business_name || ""}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="date"
              label="Payment Date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ min: 0, step: "0.01" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentFormOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitPayment}
              variant="contained"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Payment"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
