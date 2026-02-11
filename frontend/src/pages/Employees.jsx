import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Button,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { UserPlus, Search, RefreshCw } from 'lucide-react';

import EmployeeTable from '../components/EmployeeTable';
import AddEmployeeDialog from '../components/AddEmployeeDialog';
import AttendanceDialog from '../components/AttendanceDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchEmployees, fetchDepartments, deleteEmployee } from '../api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (deptFilter) params.department = deptFilter;
      const res = await fetchEmployees(params);
      setEmployees(res.data);
    } catch {
      showSnack('Failed to load employees.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter]);

  const loadDepartments = useCallback(async () => {
    try {
      const res = await fetchDepartments();
      setDepartments(res.data);
    } catch {
    }
  }, []);

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, [loadEmployees, loadDepartments]);


  const handleEmployeeSaved = () => {
    loadEmployees();
    loadDepartments();
    showSnack(editEmployee ? 'Employee updated!' : 'Employee added!');
    setEditEmployee(null);
  };

  const handleDeleteClick = (emp) => {
    setEmployeeToDelete(emp);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(employeeToDelete.id);
      showSnack(`${employeeToDelete.full_name} deleted.`);
      setConfirmOpen(false);
      setEmployeeToDelete(null);
      loadEmployees();
      loadDepartments();
    } catch {
      showSnack('Failed to delete employee.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (emp) => {
    setEditEmployee(emp);
    setAddOpen(true);
  };

  const handleViewAttendance = (emp) => {
    setSelectedEmployee(emp);
    setAttendanceOpen(true);
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            placeholder="Search by name, email, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} style={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              minWidth: 300,
              bgcolor: '#fff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
            }}
          />

          <TextField
            select
            size="small"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            label="Department"
            sx={{
              minWidth: 200,
              bgcolor: '#fff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
            }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => {
              setSearch('');
              setDeptFilter('');
            }}
            sx={{
              borderRadius: 2,
              color: '#64748b',
              borderColor: '#cbd5e1',
              px: 2.5,
              height: 40,
            }}
          >
            Reset
          </Button>

          <Box sx={{ flex: 1 }} />

          <Button
            variant="contained"
            startIcon={<UserPlus size={18} />}
            onClick={() => {
              setEditEmployee(null);
              setAddOpen(true);
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              height: 40,
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(59,130,246,0.4)',
              },
            }}
          >
            Add Employee
          </Button>
        </Box>
      </Paper>

      <Typography
        variant="body2"
        sx={{ color: '#64748b', mb: 2.5, fontWeight: 500, px: 0.5 }}
      >
        Showing {employees.length} employee{employees.length !== 1 && 's'}
        {(search || deptFilter) && ' (filtered)'}
      </Typography>

      <Paper
        sx={{
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <EmployeeTable
          rows={employees}
          loading={loading}
          onViewAttendance={handleViewAttendance}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Paper>


      <AddEmployeeDialog
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setEditEmployee(null);
        }}
        onSaved={handleEmployeeSaved}
        employee={editEmployee}
      />

      <AttendanceDialog
        open={attendanceOpen}
        onClose={() => {
          setAttendanceOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onMarked={loadEmployees}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete "${employeeToDelete?.full_name}"? All attendance records will also be permanently removed.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setConfirmOpen(false);
          setEmployeeToDelete(null);
        }}
        loading={deleting}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
