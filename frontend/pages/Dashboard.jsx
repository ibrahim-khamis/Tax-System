import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import AdminLayout from "../layouts/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(

        "http://127.0.0.1:8000/api/dashboard-stats/",
        {
        
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats ? stats.total_users : null,
    },
    {
      label: "Paid",
      value: stats ? stats.paid : null,
    },
    {
      label: "Unpaid",
      value: stats ? stats.unpaid : null,
    },
    {
      label: "Total Revenue",
      value: stats ? `${Number(stats.total_revenue).toLocaleString()} Tsh` : null,
    },
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
          Overview
        </Typography>

        <Grid container spacing={2}>
          {statCards.map((c) => (
            <Grid key={c.label} item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {c.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                    {c.value === null ? <Skeleton width={90} /> : c.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default Dashboard;
