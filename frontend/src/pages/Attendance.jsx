import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Snackbar,
    InputAdornment,
    Stack,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    RefreshCw,
    Save,
    Clock
} from 'lucide-react';
import { fetchDailyAttendance, markAttendance } from '../api';


function AttendanceStat({ label, value, color, icon: Icon }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${color}`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#fff'
            }}
        >
            <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.5 }}>
                    {value}
                </Typography>
            </Box>
            <Box sx={{ p: 1, borderRadius: 1, bgcolor: `${color}15`, color: color }}>
                <Icon size={20} />
            </Box>
        </Paper>
    );
}


export default function Attendance() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [marking, setMarking] = useState(null);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

    const displayDate = new Date(selectedDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();

    const loadRecords = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchDailyAttendance(selectedDate);
            setRecords(res.data);
        } catch (err) {
            setError('System Error: Could not retrieve attendance register.');
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        loadRecords();
    }, [loadRecords]);

    const handleMark = async (employeePk, status) => {
        setMarking(employeePk);
        try {
            await markAttendance({
                employee: employeePk,
                date: selectedDate,
                status,
            });
            setRecords(prev => prev.map(r =>
                r.employee_pk === employeePk ? { ...r, status } : r
            ));
            setSnack({ open: true, message: `Record updated: ${status}`, severity: 'success' });
        } catch {
            setSnack({ open: true, message: 'Transaction Failed', severity: 'error' });
            loadRecords();
        } finally {
            setMarking(null);
        }
    };

    const filtered = records.filter(
        (r) =>
            r.employee_name.toLowerCase().includes(search.toLowerCase()) ||
            r.employee_id.toLowerCase().includes(search.toLowerCase()) ||
            r.department.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        present: records.filter((r) => r.status === 'Present').length,
        absent: records.filter((r) => r.status === 'Absent').length,
        pending: records.filter((r) => !r.status).length,
        total: records.length
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 0,
                    mb: 3,
                    border: '1px solid #cbd5e1',
                    borderRadius: 1,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ bgcolor: '#1e293b', color: '#fff', px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarDays size={20} className="text-blue-400" />
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: 0.5 }}>
                                DAILY ATTENDANCE REGISTER
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: 1 }}>
                                MUSTER ROLL: {displayDate}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Chip
                            label={selectedDate === new Date().toISOString().slice(0, 10) ? "TODAY" : "ARCHIVE"}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, borderRadius: 0.5 }}
                        />
                    </Box>
                </Box>

                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <TextField
                                type="date"
                                label="Select Register Date"
                                size="small"
                                fullWidth
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ bgcolor: '#fff' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                placeholder="Search by ID, Name or Dept..."
                                size="small"
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>,
                                    sx: { bgcolor: '#fff' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={loadRecords}
                                startIcon={<RefreshCw size={14} />}
                                sx={{ bgcolor: '#fff', color: '#475569', borderColor: '#cbd5e1' }}
                            >
                                Refresh
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                disabled
                                startIcon={<Save size={14} />}
                                sx={{ bgcolor: '#0f172a' }}
                            >
                                Export Report
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                    <AttendanceStat label="Total Strength" value={stats.total} color="#64748b" icon={Filter} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <AttendanceStat label="Marked Present" value={stats.present} color="#10b981" icon={CheckCircle2} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <AttendanceStat label="Marked Absent" value={stats.absent} color="#ef4444" icon={XCircle} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <AttendanceStat label="Pending Action" value={stats.pending} color="#f59e0b" icon={Clock} />
                </Grid>
            </Grid>

            {error && (
                <Alert severity="error" variant="filled" sx={{ mb: 2, borderRadius: 1 }}>
                    {error}
                </Alert>
            )}

            <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={30} sx={{ color: '#0f172a' }} />
                    </Box>
                ) : (
                    <TableContainer sx={{ maxHeight: '60vh' }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {['Emp ID', 'Personnel Name', 'Department', 'Status', 'Action'].map((head) => (
                                        <TableCell
                                            key={head}
                                            sx={{
                                                bgcolor: '#f1f5f9',
                                                color: '#475569',
                                                fontWeight: 700,
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                py: 1.5,
                                                borderBottom: '2px solid #e2e8f0'
                                            }}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#94a3b8' }}>
                                            <AlertCircle size={40} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                            <Typography variant="body2">No records found for this criteria.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((row) => (
                                        <TableRow
                                            key={row.employee_pk}
                                            hover
                                            sx={{ '&:last-child td': { borderBottom: 0 } }}
                                        >
                                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#475569' }}>
                                                {row.employee_id}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                {row.employee_name}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.department}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderRadius: 0.5, height: 20, fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {row.status ? (
                                                    <Chip
                                                        icon={row.status === 'Present' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                        label={row.status.toUpperCase()}
                                                        size="small"
                                                        color={row.status === 'Present' ? 'success' : 'error'}
                                                        sx={{
                                                            borderRadius: 0.5,
                                                            height: 24,
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            minWidth: 80,
                                                            justifyContent: 'flex-start',
                                                            pl: 0.5
                                                        }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="PENDING"
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 0.5,
                                                            height: 24,
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            bgcolor: '#f1f5f9',
                                                            color: '#94a3b8',
                                                            border: '1px dashed #cbd5e1'
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Tooltip title="Mark Present">
                                                        <Button
                                                            variant={row.status === 'Present' ? 'contained' : 'outlined'}
                                                            color="success"
                                                            size="small"
                                                            onClick={() => handleMark(row.employee_pk, 'Present')}
                                                            disabled={marking === row.employee_pk}
                                                            sx={{
                                                                minWidth: 32,
                                                                width: 32,
                                                                height: 32,
                                                                p: 0,
                                                                borderRadius: 1
                                                            }}
                                                        >
                                                            {marking === row.employee_pk ? <CircularProgress size={14} color="inherit" /> : <CheckCircle2 size={16} />}
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Mark Absent">
                                                        <Button
                                                            variant={row.status === 'Absent' ? 'contained' : 'outlined'}
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleMark(row.employee_pk, 'Absent')}
                                                            disabled={marking === row.employee_pk}
                                                            sx={{
                                                                minWidth: 32,
                                                                width: 32,
                                                                height: 32,
                                                                p: 0,
                                                                borderRadius: 1
                                                            }}
                                                        >
                                                            {marking === row.employee_pk ? <CircularProgress size={14} color="inherit" /> : <XCircle size={16} />}
                                                        </Button>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Snackbar
                open={snack.open}
                autoHideDuration={2000}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
                    severity={snack.severity}
                    variant="filled"
                    sx={{ borderRadius: 1 }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}