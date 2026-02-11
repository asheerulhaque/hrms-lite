from rest_framework import serializers
from .models import Employee, Attendance


class EmployeeSerializer(serializers.ModelSerializer):
    total_present_days = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_id",
            "full_name",
            "email",
            "department",
            "created_at",
            "total_present_days",
        ]

    def validate_email(self, value):
        """Return a clear message when the email is already taken."""
        qs = Employee.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Email already exists.")
        return value.lower()

    def validate_employee_id(self, value):
        qs = Employee.objects.filter(employee_id__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Employee ID already exists.")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.full_name", read_only=True
    )

    class Meta:
        model = Attendance
        fields = ["id", "employee", "employee_name", "date", "status"]


class MarkAttendanceSerializer(serializers.Serializer):
    """Used for the POST /api/attendance/ upsert endpoint."""

    employee = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all()
    )
    date = serializers.DateField()
    status = serializers.ChoiceField(choices=Attendance.Status.choices)

    def create(self, validated_data):
        attendance, _ = Attendance.objects.update_or_create(
            employee=validated_data["employee"],
            date=validated_data["date"],
            defaults={"status": validated_data["status"]},
        )
        return attendance
