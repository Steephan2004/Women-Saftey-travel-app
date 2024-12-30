from rest_framework import serializers
from .models import HarassmentReport,Complaint,AudioFile

class HarassmentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = HarassmentReport
        fields = '__all__'
class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'
class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ['file', 'uploaded_at']