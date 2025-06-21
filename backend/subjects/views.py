from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Subject
from .serializers import SubjectSerializer, SubjectDetailSerializer, TopicSerializer

@api_view(['GET', 'POST'])
def subject_list(request):
    if request.method == 'GET':
        # Get distinct subject names
        subject_names = Subject.objects.values('subject_name').distinct()
        
        # Build the response by grouping chapters and topics under each subject
        subjects_data = []
        for subject in subject_names:
            subject_name = subject['subject_name']
            # Get all chapters for this subject
            chapters = Subject.objects.filter(subject_name=subject_name).values('chapter_number', 'chapter_name').distinct()
            
            chapters_data = []
            for chapter in chapters:
                # Get all topics for this chapter
                topics = Subject.objects.filter(
                    subject_name=subject_name,
                    chapter_number=chapter['chapter_number'],
                    chapter_name=chapter['chapter_name']
                )
                topics_data = [{'topic_number': topic.topic_number, 'topic_name': topic.topic_name} for topic in topics]
                
                chapters_data.append({
                    'chapter_number': chapter['chapter_number'],
                    'chapter_name': chapter['chapter_name'],
                    'topics': topics_data
                })
            
            subjects_data.append({
                'subject_name': subject_name,
                'chapters': chapters_data
            })
        
        serializer = SubjectDetailSerializer(subjects_data, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # Fetch the grouped data for the response
            subject = Subject.objects.filter(
                subject_name=serializer.data['subject_name'],
                chapter_number=serializer.data['chapter_number'],
                chapter_name=serializer.data['chapter_name']
            )
            topics = [{'topic_number': s.topic_number, 'topic_name': s.topic_name} for s in subject]
            grouped_data = {
                'subject_name': serializer.data['subject_name'],
                'chapter_number': serializer.data['chapter_number'],
                'chapter_name': serializer.data['chapter_name'],
                'topics': topics
            }
            return Response([grouped_data], status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def chapter_list(request, subject_name):
    chapters = Subject.objects.filter(subject_name=subject_name).values('chapter_number', 'chapter_name').distinct()
    return Response(list(chapters))

@api_view(['GET'])
def topic_list(request, subject_name, chapter_number):
    subjects = Subject.objects.filter(subject_name=subject_name, chapter_number=chapter_number)
    if not subjects.exists():
        return Response({'error': 'Chapter not found for this subject'}, status=status.HTTP_404_NOT_FOUND)
    
    topics = [{'topic_number': subject.topic_number, 'topic_name': subject.topic_name} for subject in subjects]
    grouped_data = {
        'subject_name': subject_name,
        'chapter_number': chapter_number,
        'chapter_name': subjects.first().chapter_name,
        'topics': topics
    }
    return Response([grouped_data])

@api_view(['POST'])
def add_topics(request, subject_name, chapter_number):
    try:
        existing_subject = Subject.objects.filter(subject_name=subject_name, chapter_number=chapter_number).first()
        if not existing_subject:
            return Response({'error': 'Chapter not found for this subject'}, status=status.HTTP_404_NOT_FOUND)
        chapter_name = existing_subject.chapter_name
    except Subject.DoesNotExist:
        return Response({'error': 'Chapter not found for this subject'}, status=status.HTTP_404_NOT_FOUND)

    topics = request.data.get('topics', [])
    if not topics:
        return Response({'error': 'At least one topic must be provided'}, status=status.HTTP_400_BAD_REQUEST)

    responses = []
    for topic in topics:
        data = {
            'subject_name': subject_name,
            'chapter_number': chapter_number,
            'chapter_name': chapter_name,
            'topic_number': topic.get('topic_number'),
            'topic_name': topic.get('topic_name')
        }
        serializer = SubjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            responses.append({
                'topic_number': serializer.data['topic_number'],
                'topic_name': serializer.data['topic_name']
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    updated_subjects = Subject.objects.filter(subject_name=subject_name, chapter_number=chapter_number)
    topics = [{'topic_number': s.topic_number, 'topic_name': s.topic_name} for s in updated_subjects]
    grouped_data = {
        'subject_name': subject_name,
        'chapter_number': chapter_number,
        'chapter_name': chapter_name,
        'topics': topics
    }
    return Response([grouped_data], status=status.HTTP_201_CREATED)