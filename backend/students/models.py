from django.db import models

# class Student(models.Model):
#     student_id = models.CharField(max_length=10, unique=True)
#     name = models.CharField(max_length=100)
#     percentage = models.FloatField()
#     image = models.URLField(blank=True, null=True)

    # def __str__(self):
    #     return f"{self.name} ({self.student_id})"
    # from django.db import models

class Student(models.Model):
    student_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='student_images/', null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        managed = False
        db_table = 'student_details'