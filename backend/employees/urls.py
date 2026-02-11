from django.urls import path
from . import views

urlpatterns = [
    path(
        "dashboard/",
        views.DashboardView.as_view(),
        name="dashboard",
    ),
    path(
        "employees/",
        views.EmployeeListCreateView.as_view(),
        name="employee-list-create",
    ),
    path(
        "employees/<int:pk>/",
        views.EmployeeDetailView.as_view(),
        name="employee-detail",
    ),
    path(
        "departments/",
        views.DepartmentListView.as_view(),
        name="department-list",
    ),
    path(
        "attendance/",
        views.MarkAttendanceView.as_view(),
        name="mark-attendance",
    ),
    path(
        "attendance/daily/",
        views.DailyAttendanceView.as_view(),
        name="daily-attendance",
    ),
    path(
        "attendance/<int:employee_pk>/",
        views.AttendanceHistoryView.as_view(),
        name="attendance-history",
    ),
]
