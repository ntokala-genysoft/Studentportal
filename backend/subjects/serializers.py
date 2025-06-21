from rest_framework import serializers
from .models import Subject

class TopicSerializer(serializers.Serializer):
    topic_number = serializers.CharField(max_length=10)
    topic_name = serializers.CharField(max_length=200)

class ChapterSerializer(serializers.Serializer):
    chapter_number = serializers.IntegerField()
    chapter_name = serializers.CharField(max_length=100)
    topics = TopicSerializer(many=True)

class SubjectDetailSerializer(serializers.Serializer):
    subject_name = serializers.CharField(max_length=100)
    chapters = ChapterSerializer(many=True)

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_name', 'chapter_number', 'chapter_name', 'topic_number', 'topic_name']

    def validate(self, data):
        # Ensure all fields are provided
        required_fields = ['subject_name', 'chapter_number', 'chapter_name', 'topic_number', 'topic_name']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: f"{field} is required."})
        return data