from django.db import models

class StudentDetail(models.Model):
    student_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'student_details'

    def __str__(self):
        return self.name

class Attendance(models.Model):
    PERIOD_CHOICES = [
        ('Jan-Feb', 'Jan-Feb'),
        ('Mar-Apr', 'Mar-Apr'),
        ('May-Jun', 'May-Jun'),
        ('Jul-Aug', 'Jul-Aug'),
        ('Sep-Oct', 'Sep-Oct'),
        ('Nov-Dec', 'Nov-Dec'),
    ]

    student = models.ForeignKey(StudentDetail, on_delete=models.CASCADE)
    period = models.CharField(max_length=7, choices=PERIOD_CHOICES)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attendance'
        unique_together = ('student', 'period')  # Ensure student and period combination is unique

    def __str__(self):
        return f"{self.student.name} - {self.period}: {self.percentage}%"