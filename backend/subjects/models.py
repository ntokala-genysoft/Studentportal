from django.db import models

class Subject(models.Model):
    subject_name = models.CharField(max_length=100)  # e.g., "Social", not unique
    chapter_number = models.IntegerField()  # e.g., 1
    chapter_name = models.CharField(max_length=100)  # e.g., "History"
    topic_number = models.CharField(max_length=10)  # e.g., "1.1"
    topic_name = models.CharField(max_length=200)  # e.g., "Some Topic"

    def __str__(self):
        return f"{self.subject_name} - Chapter {self.chapter_number}: {self.chapter_name} - Topic {self.topic_number}: {self.topic_name}"

    class Meta:
        db_table = 'subject'  # Custom table name in the database
        constraints = [
            models.UniqueConstraint(
                fields=['subject_name', 'chapter_number', 'chapter_name', 'topic_number', 'topic_name'],
                name='unique_topic_in_ch May 12, 2025 - 18:32:18 UTC+0530unique_topic_in_chapter'
            )
        ]