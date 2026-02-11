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


class EmployeeListCreateView(generics.ListCreateAPIView):
    """GET /api/employees/  — list all (with total_present_days)
    POST /api/employees/ — create a new employee"""

    serializer_class = EmployeeSerializer

    def get_queryset(self):
        return Employee.objects.annotate(
            total_present_days=Count(
                "attendances",
                filter=Q(attendances__status=Attendance.Status.PRESENT),
            )
        )


class EmployeeDeleteView(generics.DestroyAPIView):
    """DELETE /api/employees/<pk>/  — cascade-deletes attendance too"""

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class MarkAttendanceView(APIView):
    """POST /api/attendance/  — upsert attendance record"""

    def post(self, request):
        serializer = MarkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attendance = serializer.save()
        return Response(
            AttendanceSerializer(attendance).data,
            status=status.HTTP_200_OK,
        )


class AttendanceHistoryView(generics.ListAPIView):
    """GET /api/attendance/<employee_pk>/  — history for one employee"""

    serializer_class = AttendanceSerializer

    def get_queryset(self):
        return Attendance.objects.filter(
            employee_id=self.kwargs["employee_pk"]
        )
