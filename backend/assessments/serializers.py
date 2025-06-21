from rest_framework import serializers
from .models import Assessment

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = [
            'id', 'subject_name', 'exam_name', 'date', 'duration', 'total_marks',
            'question_text', 'option1', 'option2', 'option3', 'option4', 'correct_option', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        if data['correct_option'] not in [1, 2, 3, 4]:
            raise serializers.ValidationError("Correct option must be between 1 and 4")
        return data