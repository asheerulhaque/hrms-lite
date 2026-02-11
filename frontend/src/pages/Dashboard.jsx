import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    LinearProgress,
    Button,
    Divider,
    Stack,
    IconButton,
} from '@mui/material';
import {
    Users,
    UserCheck,
    UserX,
    Building2,
    Activity,
    ArrowRight,
    RefreshCw,
    FileText,
    Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboard } from '../api';


function MetricTile({ label, value, subLabel, icon: Icon, color, trend }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                height: '100%',
                border: '1px solid #e2e8f0',
                borderLeft: `5px solid ${color}`,
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                '&:hover': {
                    bgcolor: '#f8fafc',
                    borderColor: '#cbd5e1',
                    borderLeftColor: color,
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 1 }}>
                        {label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.5 }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{
                    p: 1,
                    bgcolor: `${color}10`,
                    color: color,
                    borderRadius: 1
                }}>
                    <Icon size={20} />
                </Box>
            </Box>

            <Divider sx={{ mb: 1.5, borderStyle: 'dashed' }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {subLabel}
                </Typography>
            </Box>
        </Paper>
    );
}

function SectionHeader({ title, icon: Icon, action }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Icon size={18} className="text-slate-500" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {title}
                </Typography>
            </Box>
            {action}
        </Box>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        setRefreshing(true);
        try {
            const res = await fetchDashboard();
            setData(res.data);
            setError(null);
        } catch (err) {
            setError('System Alert: Backend connection failure.');
        } finally {
            setLoading(false);
            setTimeout(() => setRefreshing(false), 500);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
                <CircularProgress size={40} thickness={4} sx={{ color: '#0f172a' }} />
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: 2 }}>Initializing Dashboard...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" variant="filled" sx={{ borderRadius: 1, mt: 4 }}>
                {error}
            </Alert>
        );
    }

    const { total_employees, departments, today, recent_activity } = data;
    const attendanceRate = total_employees > 0 ? Math.round((today.present / total_employees) * 100) : 0;

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 4,
                    bgcolor: '#1e293b',
                    color: '#fff',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                        EXECUTIVE OVERVIEW
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: 1 }}>
                        SYSTEM DATE: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />}
                        onClick={loadData}
                        sx={{ color: '#e2e8f0', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
                    >
                        Refresh Data
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<FileText size={14} />}
                        onClick={() => navigate('/attendance')}
                        sx={{ bgcolor: '#3b82f6', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2563eb' } }}
                    >
                        Daily Report
                    </Button>
                </Stack>
            </Paper>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricTile
                        label="Total Workforce"
                        value={total_employees}
                        subLabel="Registered Personnel"
                        icon={Users}
                        color="#3b82f6"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricTile
                        label="Present Today"
                        value={today.present}
                        subLabel={`${attendanceRate}% Attendance Rate`}
                        icon={UserCheck}
                        color="#10b981"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricTile
                        label="Absent / Leave"
                        value={today.absent}
                        subLabel="Requires Action"
                        icon={UserX}
                        color="#ef4444"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricTile
                        label="Departments"
                        value={departments.length}
                        subLabel="Operational Units"
                        icon={Building2}
                        color="#8b5cf6"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <SectionHeader title="Workforce Distribution" icon={Building2} />
                    <Paper variant="outlined" sx={{ p: 0, borderRadius: 1, overflow: 'hidden' }}>
                        {departments.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>No departmental data available.</Typography>
                            </Box>
                        ) : (
                            <Box>
                                {departments.map((dept, index) => (
                                    <Box
                                        key={dept.department}
                                        sx={{
                                            p: 2,
                                            borderBottom: index !== departments.length - 1 ? '1px solid #f1f5f9' : 'none',
                                            '&:hover': { bgcolor: '#f8fafc' }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                {dept.department}
                                            </Typography>
                                            <Chip label={dept.count} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#f1f5f9' }} />
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(dept.count / Math.max(...departments.map(d => d.count))) * 100}
                                            sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#475569' } }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                        <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <Button size="small" onClick={() => navigate('/employees')} endIcon={<ArrowRight size={14} />} sx={{ color: '#475569', textTransform: 'none' }}>
                                View Directory
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <SectionHeader title="Real-Time Attendance Logs" icon={Activity} />
                    <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Timestamp / Date</TableCell>
                                        <TableCell sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Employee</TableCell>
                                        <TableCell sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recent_activity.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                                                No recent activity logs found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recent_activity.map((row) => (
                                            <TableRow key={row.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: '#475569' }}>
                                                    {row.date}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                    {row.employee_name}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.status.toUpperCase()}
                                                        size="small"
                                                        variant="outlined"
                                                        color={row.status === 'Present' ? 'success' : 'error'}
                                                        icon={row.status === 'Present' ? <UserCheck size={12} /> : <UserX size={12} />}
                                                        sx={{ borderRadius: 1, height: 24, fontSize: '0.7rem', fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}