from django.contrib import admin
from .models import Subject

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['subject_name', 'chapter_number', 'chapter_name', 'topic_number', 'topic_name']
    list_filter = ['subject_name', 'chapter_number']
    search_fields = ['subject_name', 'chapter_name', 'topic_name']