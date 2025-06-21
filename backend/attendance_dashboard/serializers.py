from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_id = serializers.IntegerField(source='student.student_id', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'student_id', 'student_name', 'period', 'percentage', 'created_at']
        read_only_fields = ['id', 'created_at']