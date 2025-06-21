from django import forms
from .models import Attendance, StudentDetail

class AttendanceForm(forms.ModelForm):
    class Meta:
        model = Attendance
        fields = ['student', 'period', 'percentage']
        widgets = {
            'student': forms.Select(),
            'period': forms.Select(),
            'percentage': forms.NumberInput(attrs={'step': '0.1', 'min': '0', 'max': '100'}),
        }