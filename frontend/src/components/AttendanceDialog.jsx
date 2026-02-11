import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Typography,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
} from '@mui/material';
import { Calendar, CheckCircle, XCircle, X, Filter } from 'lucide-react';
import { fetchAttendance, markAttendance } from '../api';

export default function AttendanceDialog({ open, onClose, employee, onMarked }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadHistory = useCallback(async () => {
    if (!employee) return;
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      const res = await fetchAttendance(employee.id, params);
      setRecords(res.data);
    } catch {
      setError('Failed to load attendance history.');
    } finally {
      setLoading(false);
    }
  }, [employee, dateFrom, dateTo]);

  useEffect(() => {
    if (open) {
      setDateFrom('');
      setDateTo('');
    }
  }, [open]);

  useEffect(() => {
    if (open && employee) loadHistory();
  }, [open, employee, dateFrom, dateTo, loadHistory]);

  const handleMark = async (status) => {
    setMarking(true);
    setError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await markAttendance({ employee: employee.id, date: today, status });
      await loadHistory();
      onMarked();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : 'Failed to mark attendance.');
    } finally {
      setMarking(false);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((r) => r.date === todayStr);
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        <span className="flex items-center gap-2">
          <Calendar size={20} />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Attendance — {employee?.full_name}
          </Typography>
        </span>
        <IconButton size="small" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2.5,
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Today ({todayStr}):
            </Typography>
            {todayRecord ? (
              <Chip
                label={todayRecord.status}
                color={todayRecord.status === 'Present' ? 'success' : 'error'}
                size="small"
              />
            ) : (
              <Chip label="Not marked" size="small" variant="outlined" />
            )}
            <Box sx={{ flex: 1 }} />
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={marking}
              onClick={() => handleMark('Present')}
              startIcon={
                marking ? (
                  <CircularProgress size={14} />
                ) : (
                  <CheckCircle size={14} />
                )
              }
              sx={{ textTransform: 'none' }}
            >
              Present
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              disabled={marking}
              onClick={() => handleMark('Absent')}
              startIcon={
                marking ? (
                  <CircularProgress size={14} />
                ) : (
                  <XCircle size={14} />
                )
              }
              sx={{ textTransform: 'none' }}
            >
              Absent
            </Button>
          </Stack>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2.5,
            border: '1px solid #e2e8f0',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Filter size={16} style={{ color: '#64748b' }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: '#475569' }}
            >
              Filter:
            </Typography>
            <TextField
              type="date"
              size="small"
              label="From"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ width: 160 }}
            />
            <TextField
              type="date"
              size="small"
              label="To"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ width: 160 }}
            />
            {(dateFrom || dateTo) && (
              <Button
                size="small"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                sx={{ color: '#64748b' }}
              >
                Clear
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" spacing={1}>
              <Chip
                label={`${presentCount} Present`}
                size="small"
                color="success"
                variant="outlined"
              />
              <Chip
                label={`${absentCount} Absent`}
                size="small"
                color="error"
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Paper>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : records.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Calendar
              size={40}
              style={{ color: '#cbd5e1', margin: '0 auto 12px' }}
            />
            <Typography variant="body2" color="text.secondary">
              No attendance records found.
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ maxHeight: 340, borderRadius: 2 }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 2, fontSize: '0.8125rem' }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 2, fontSize: '0.8125rem' }}
                  >
                    Day
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 2, fontSize: '0.8125rem' }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((r) => {
                  const day = new Date(
                    r.date + 'T00:00:00'
                  ).toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ py: 2 }}>{r.date}</TableCell>
                      <TableCell sx={{ color: '#64748b', py: 2 }}>{day}</TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={r.status}
                          size="small"
                          color={
                            r.status === 'Present' ? 'success' : 'error'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
