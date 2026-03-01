import React, { useState, useEffect } from "react";
import { getusers, createuser, updateuser, deleteuser, createbusiness } from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AdminLayout from "../layouts/AdminLayout";





const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showView, setShowView] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  // form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("not paid");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getusers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users. Check console.");
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setAddress("");
    setUsername("");
    setPassword("");
    setBusinessName("");
    setBusinessType("");
    setLocation("");
    setStatus("not paid");
  };

  const handleCreateUser = async () => {
    if (!firstName || !lastName || !address || !username.trim() || !password || !businessName) {
      alert("Please fill all required fields!");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    try {
      // create user
      const userRes = await createuser({
        first_name: firstName,
        last_name: lastName,
        address: address,
        username: username.trim(),
        password: password,
        role: "customer",
      });

      const userId = userRes.data.id;

      // create business
      await createbusiness({
        user: userId,
        business_name: businessName,
        business_type: businessType,
        location: location,
        status: status,
      });

      alert("User created successfully!");
      setShowForm(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Failed to create user:", err);
      if (err.response && err.response.data) {
        alert("Backend error: " + JSON.stringify(err.response.data));
      } else {
        alert("Failed to create user. Check console for details.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteuser(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user. Check console.");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setAddress(user.address);
    setShowEdit(true);
  };

  const handleUpdateUser = async () => {
    try {
      await updateuser(editUser.id, {
        first_name: firstName,
        last_name: lastName,
        address: address,
      });

      alert("User updated successfully");
      setShowEdit(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user. Check console.");
    }
  };



  const handleView = (user) => {
    setViewUser(user);
    setShowView(true);
  };

  return (
    <AdminLayout title="Tax Payers">
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Tax Payers
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>Back</Button>
            <Button variant="contained" onClick={() => setShowForm(true)}>Add New User</Button>
          </Box>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 56, whiteSpace: "nowrap" }}>#</TableCell>
                <TableCell sx={{ width: 180, whiteSpace: "nowrap" }}>First Name</TableCell>
                <TableCell sx={{ width: 180, whiteSpace: "nowrap" }}>Last Name</TableCell>
                <TableCell sx={{ minWidth: 240 }}>Username</TableCell>
                <TableCell sx={{ minWidth: 320 }}>Address</TableCell>
                <TableCell sx={{ width: 120, whiteSpace: "nowrap" }}>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u, i) => (
                <TableRow key={u.id} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{u.first_name}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{u.last_name}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.address}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{u.role}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "inline-flex", gap: 1 }}>
                      <Button size="small" variant="text" onClick={() => handleView(u)}>View</Button>
                      <Button size="small" variant="text" onClick={() => handleEdit(u)}>Edit</Button>
                      <Button size="small" color="error" variant="text" onClick={() => handleDelete(u.id)}>Delete</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={showForm}
          onClose={() => {
            setShowForm(false);
            resetForm();
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
              <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
              <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
              <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth sx={{ gridColumn: "1 / -1" }} />
              <Divider sx={{ gridColumn: "1 / -1" }} />
              <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
              <Divider sx={{ gridColumn: "1 / -1" }} />
              <TextField label="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} fullWidth sx={{ gridColumn: "1 / -1" }} />
              <TextField label="Business Type" value={businessType} onChange={(e) => setBusinessType(e.target.value)} fullWidth />
              <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value="not paid">Not Paid</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreateUser}>
              Create
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={showEdit}
          onClose={() => {
            setShowEdit(false);
            resetForm();
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
              <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
              <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
              <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth sx={{ gridColumn: "1 / -1" }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowEdit(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUpdateUser}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={showView}
          onClose={() => setShowView(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>User Details</DialogTitle>
          <DialogContent dividers>
            {viewUser && (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 1 }}>
                <Typography variant="body2"><b>First Name:</b> {viewUser.first_name}</Typography>
                <Typography variant="body2"><b>Last Name:</b> {viewUser.last_name}</Typography>
                <Typography variant="body2"><b>Username:</b> {viewUser.username}</Typography>
                <Typography variant="body2"><b>Address:</b> {viewUser.address}</Typography>
                <Typography variant="body2"><b>Role:</b> {viewUser.role}</Typography>
                <Typography variant="body2">
                  <b>Business:</b> {viewUser.businesses && viewUser.businesses.map((b) => `${b.business_name} (${b.status})`).join(", ")}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowView(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};



export default Users;
