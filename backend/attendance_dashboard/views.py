from django.shortcuts import render, redirect
from rest_framework import viewsets
from .models import Attendance, StudentDetail
from .forms import AttendanceForm
from .serializers import AttendanceSerializer

# Dashboard View
def dashboard(request):
    attendance_records = Attendance.objects.all()
    if request.method == 'POST':
        form = AttendanceForm(request.POST)
        if form.is_valid():
            period = form.cleaned_data['period']
            percentage = form.cleaned_data['percentage']
            student_id = form.cleaned_data['student']  # Get the student
            Attendance.objects.update_or_create(
                student=student_id,
                period=period,
                defaults={'percentage': percentage}
            )
            return redirect('dashboard')
    else:
        form = AttendanceForm()
    return render(request, 'attendance_dashboard/dashboard.html', {
        'form': form,
        'attendance_records': attendance_records
    })

# API ViewSet for Attendance
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer