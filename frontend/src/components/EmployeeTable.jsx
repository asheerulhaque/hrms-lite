import { Button, IconButton, Tooltip, Chip, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Trash2, Eye, Pencil, Users } from 'lucide-react';

export default function EmployeeTable({
  rows,
  loading,
  onViewAttendance,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      field: 'employee_id',
      headerName: 'Employee ID',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'full_name',
      headerName: 'Full Name',
      flex: 1.4,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.4,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#475569' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{ borderRadius: 1.5, fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'total_present_days',
      headerName: 'Present Days',
      type: 'number',
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Chip
          label={params.value ?? 0}
          size="small"
          color="success"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      flex: 1.2,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="View Attendance History">
            <Button
              size="small"
              variant="outlined"
              startIcon={<Eye size={14} />}
              onClick={() => onViewAttendance(params.row)}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                borderRadius: 1.5,
              }}
            >
              Attendance
            </Button>
          </Tooltip>
          <Tooltip title="Edit Employee">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(params.row)}
            >
              <Pencil size={15} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Employee">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(params.row)}
            >
              <Trash2 size={15} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Users
                size={52}
                style={{ color: '#cbd5e1', margin: '0 auto 16px' }}
              />
              <Typography
                variant="h6"
                sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
              >
                No employees found
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Click &ldquo;Add Employee&rdquo; to get started.
              </Typography>
            </Box>
          ),
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: '#475569',
            height: '56px !important',
            minHeight: '56px !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem',
            padding: '16px',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
            minHeight: '64px !important',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e2e8f0',
            minHeight: '56px',
          },
          '& .MuiTablePagination-root': {
            color: '#64748b',
          },
        }}
      />
    </div>
  );
}
