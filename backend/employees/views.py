import datetime
from django.db.models import Count, Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Employee, Attendance
from .serializers import (
    EmployeeSerializer,
    AttendanceSerializer,
    MarkAttendanceSerializer,
)

# --------------------------
# 1. DASHBOARD VIEW (Fixed)
# --------------------------
class DashboardView(APIView):
    """
    GET /api/dashboard/
    Returns summary stats for the dashboard widgets.
    """
    def get(self, request):
        today = datetime.date.today()
        
        # 1. Total Employees
        total_employees = Employee.objects.count()
        
        # 2. Today's Stats
        present_count = Attendance.objects.filter(date=today, status='Present').count()
        absent_count = Attendance.objects.filter(date=today, status='Absent').count()
        
        # 3. Department Breakdown
        # Returns [{'department': 'IT', 'count': 5}, ...]
        dept_counts = Employee.objects.values('department').annotate(count=Count('id'))
        
        # 4. Recent Activity (Last 5 records)
        recent_activity = Attendance.objects.select_related('employee').order_by('-date', '-id')[:5]
        recent_serializer = AttendanceSerializer(recent_activity, many=True)

        data = {
            "total_employees": total_employees,
            "today": {
                "date": today,
                "present": present_count,
                "absent": absent_count
            },
            "departments": dept_counts,
            "recent_activity": recent_serializer.data
        }
        return Response(data)

# --------------------------
# 2. EMPLOYEE VIEWS
# --------------------------
class EmployeeListCreateView(generics.ListCreateAPIView):
    """
    GET /api/employees/
    POST /api/employees/
    """
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        # Annotate with total days present for the list view
        return Employee.objects.annotate(
            total_present_days=Count(
                "attendances",
                filter=Q(attendances__status=Attendance.Status.PRESENT),
            )
        ).order_by('-created_at')

class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/employees/<pk>/
    PUT /api/employees/<pk>/
    DELETE /api/employees/<pk>/
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class DepartmentListView(APIView):
    """
    GET /api/departments/
    Returns a list of unique departments for the dropdown filter.
    """
    def get(self, request):
        # distinct() ensures we don't get duplicates
        departments = Employee.objects.values_list('department', flat=True).distinct().order_by('department')
        return Response(departments)

# --------------------------
# 3. ATTENDANCE VIEWS
# --------------------------
class MarkAttendanceView(APIView):
    """
    POST /api/attendance/
    Upserts (Create or Update) an attendance record.
    """
    def post(self, request):
        serializer = MarkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attendance = serializer.save()
        return Response(
            AttendanceSerializer(attendance).data,
            status=status.HTTP_200_OK,
        )

class DailyAttendanceView(APIView):
    """
    GET /api/attendance/daily/?date=YYYY-MM-DD
    Returns a list of ALL employees with their status for a specific date.
    This is used for the "Attendance Register" view.
    """
    def get(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({"error": "Date parameter is required"}, status=400)
        
        # 1. Get all employees
        employees = Employee.objects.all().order_by('employee_id')
        
        # 2. Get attendance records for this specific date
        attendance_records = Attendance.objects.filter(date=date_str)
        
        # 3. Create a lookup map: { employee_id_int: 'Present'/'Absent' }
        status_map = {att.employee_id: att.status for att in attendance_records}
        
        # 4. Combine data
        results = []
        for emp in employees:
            results.append({
                "employee_pk": emp.id,
                "employee_id": emp.employee_id,
                "employee_name": emp.full_name,
                "department": emp.department,
                "status": status_map.get(emp.id, None) # Returns None if not marked yet
            })
            
        return Response(results)

class AttendanceHistoryView(generics.ListAPIView):
    """
    GET /api/attendance/<employee_pk>/
    Returns history for a single employee.
    """
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        return Attendance.objects.filter(
            employee_id=self.kwargs["employee_pk"]
        ).order_by('-date')