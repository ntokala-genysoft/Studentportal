from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    # Fields to display in the admin list view
    list_display = ('period', 'percentage', 'created_at')
    
    # Fields to filter by in the admin sidebar
    list_filter = ('period', 'created_at')
    
    # Fields to search by
    search_fields = ('period',)
    
    # Order the records by period
    ordering = ('period',)
    
    # Make percentage field more readable with a percentage sign
    def percentage(self, obj):
        return f"{obj.percentage}%"
    percentage.short_description = 'Percentage'