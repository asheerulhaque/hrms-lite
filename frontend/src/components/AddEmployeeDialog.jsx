import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  Typography,
  Divider,
  IconButton,
  MenuItem,
  useTheme,
  Paper,
} from '@mui/material';
import { Save, X, Building2, User, IdCard , Mail } from 'lucide-react';
import { addEmployee, updateEmployee } from '../api';

export default function AddEmployeeDialog({ open, onClose, onSaved, employee }) {
  const theme = useTheme();
  const isEdit = Boolean(employee);

  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const DEPARTMENTS = ['IT', 'HR', 'Sales', 'Engineering', 'Operations', 'Finance', 'Legal'];

  useEffect(() => {
    if (open) {
      if (employee) {
        setForm({
          employee_id: employee.employee_id,
          full_name: employee.full_name,
          email: employee.email,
          department: employee.department,
        });
      } else {
        setForm({ employee_id: '', full_name: '', email: '', department: '' });
      }
      setError(null);
    }
  }, [open, employee]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await updateEmployee(employee.id, form);
      } else {
        await addEmployee(form);
      }
      onSaved();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.entries(data)
          .map(([key, val]) => `${key.replace('_', ' ').toUpperCase()}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        setError(messages);
      } else {
        setError('System Error: Could not save record. Please contact IT support.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#1e293b',
          color: '#fff',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '4px solid #3b82f6',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <User size={22} className="text-blue-400" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: 0.5 }}>
              {isEdit ? 'MODIFY EMPLOYEE RECORD' : 'NEW EMPLOYEE REGISTRATION'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
              Human Resource Management System
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#f8fafc', p: 4 }}>
        {error && (
          <Alert severity="error" variant="filled" sx={{ my: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, borderColor: '#e2e8f0', bgcolor: '#fff' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 1.2, display: 'block', mb: 1 }}>
              01. Identification Details
            </Typography>
            <Divider sx={{ mb: 2.5 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Employee ID"
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                  disabled={isEdit}
                  placeholder="EMP-0000"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <IdCard  size={16} style={{ marginRight: 8, color: '#94a3b8' }} />,
                    sx: { borderRadius: 1, fontFamily: 'monospace' }
                  }}
                  helperText={isEdit ? "System ID cannot be modified" : "Unique identifier (Required)"}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Full Legal Name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                  placeholder="John Doe"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <User size={16} style={{ marginRight: 8, color: '#94a3b8' }} />,
                    sx: { borderRadius: 1 }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 1.2, display: 'block', mb: 1 }}>
              02. Official Information
            </Typography>
            <Divider sx={{ mb: 2.5 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Corporate Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                  placeholder="username@company.com"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <Mail size={16} style={{ marginRight: 8, color: '#94a3b8' }} />,
                    sx: { borderRadius: 1 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <Building2 size={16} style={{ marginRight: 8, color: '#94a3b8' }} />,
                    sx: { borderRadius: 1 }
                  }}
                >
                  <MenuItem value="" disabled>Select Department</MenuItem>
                  {DEPARTMENTS.map((dept) => (
                    <MenuItem key={dept} value={dept} sx={{ fontSize: '0.875rem' }}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2.5, bgcolor: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
            * All fields marked are mandatory for processing.
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{
            color: '#475569',
            borderColor: '#cbd5e1',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 1
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !form.employee_id || !form.full_name || !form.email || !form.department}
          startIcon={loading ? null : <Save size={18} />}
          sx={{
            borderRadius: 1,
            px: 4,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#0f172a',
            '&:hover': { bgcolor: '#1e293b' }
          }}
        >
          {loading ? 'Processing...' : isEdit ? 'Update Record' : 'Save Record'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}