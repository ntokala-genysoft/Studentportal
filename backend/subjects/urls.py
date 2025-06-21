from django.urls import path
from . import views

urlpatterns = [
    path('subjects/', views.subject_list, name='subject_list'),  # List subjects or create a new subject
    path('subjects/<str:subject_name>/chapters/', views.chapter_list, name='chapter_list'),  # List chapters for a subject
    path('subjects/<str:subject_name>/chapters/<int:chapter_number>/topics/', views.topic_list, name='topic_list'),  # List topics for a chapter
    path('subjects/<str:subject_name>/chapters/<int:chapter_number>/add-topics/', views.add_topics, name='add_topics'),  # Add more topics to a chapter
]   