
from django.db import models

class Assessment(models.Model):
    subject_name = models.CharField(max_length=100)
    exam_name = models.CharField(max_length=200)
    date = models.DateField()
    duration = models.IntegerField()  # Duration in minutes
    total_marks = models.IntegerField()
    question_text = models.TextField()
    option1 = models.CharField(max_length=200)
    option2 = models.CharField(max_length=200)
    option3 = models.CharField(max_length=200)
    option4 = models.CharField(max_length=200)
    correct_option = models.IntegerField(choices=[(1, 'Option 1'), (2, 'Option 2'), (3, 'Option 3'), (4, 'Option 4')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.exam_name} - {self.subject_name} (Question: {self.question_text})"
