from django.contrib import admin
from .models import Assessment

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('subject_name', 'exam_name', 'date', 'duration', 'total_marks', 'question_text', 'correct_option', 'created_at')