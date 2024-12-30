from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.rest import Client
import json
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework import status
from .models import HarassmentReport,Complaint,AudioFile
import speech_recognition
from .serializers import HarassmentReportSerializer,ComplaintSerializer,AudioFileSerializer

# Twilio credentials
ACCOUNT_SID = "AC3018d9ecd91ec3db43549620512f6fc3"
AUTH_TOKEN = "d0a56c63f2f3bbe8052660e2984eee68"
TWILIO_PHONE_NUMBER = "+12314473862"
EMERGENCY_CONTACT = "+916383765373"  # Replace with the recipient's phone number

@csrf_exempt
def SMSAPI(request):
    if request.method == "POST":
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            latitude = data.get("latitude")
            longitude = data.get("longitude")

            if not latitude or not longitude:
                return JsonResponse({"error": "Invalid location data"}, status=400)

            # Message body
            message_body = f"Emergency Alert! Current location:\nLatitude: {latitude}\nLongitude: {longitude}"

            # Send SMS via Twilio
            client = Client(ACCOUNT_SID, AUTH_TOKEN)
            message = client.messages.create(
                body=message_body,
                from_=TWILIO_PHONE_NUMBER,
                to=EMERGENCY_CONTACT
            )

            # Respond with success
            return JsonResponse({"message": "SOS alert sent successfully!"}, status=200)

        except Exception as e:
            print(f"Error sending SMS: {e}")
            return JsonResponse({"error": "Failed to send SOS alert"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


class ReportView(APIView):
    def post(self, request):
        serializer = HarassmentReportSerializer(data=request.data)
        print(request.data)
        name=request.data.get("name")
        mobile_number = request.data.get("mobileNumber")  # Accessing the 'mobileNumber' field
        problem = request.data.get("problem")  # Accessing the 'problem' field
        vehicle_number = request.data.get("vehicleNumber")  # Accessing the 'vehicleNumber' field
        latitude=request.data.get("latitude")
        longitude=request.data.get("logitude")
        message = f"Harassment report is reported in Latitude: {latitude}\nLongitude: {longitude}\n Name:{name}\n MobileNumber:{mobile_number}\n Problem:{problem}"
        
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=EMERGENCY_CONTACT
        )
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Report submitted successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ComplaintView(APIView):
    def post(self, request):
        serializer = ComplaintSerializer(data=request.data)
        print(request.data)
        name=request.data.get("name")
        mobile_number = request.data.get("mobileNo") 
        doorNo = request.data.get("doorNo")
        streetname=request.data.get("streetname")
        city=request.data.get("city")
        pincode=request.data.get("pincode")
        subject = request.data.get("subject") 
        description = request.data.get("description")
        message = f"from,\n{name}\n{mobile_number}\n{doorNo},{streetname}\n{city}-{pincode}\n\nRespected sir,\nSub:{subject}\n{description}"

        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=EMERGENCY_CONTACT
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
@method_decorator(csrf_exempt, name='dispatch')
class AudioUploadView(APIView):
    parser_classes = [MultiPartParser]  # To handle multipart form data

    def post(self, request, *args, **kwargs):
        # Check if the file exists in the request
        file = request.FILES.get('audio')
        if not file:
            return JsonResponse({"error": "No audio file provided"}, status=400)
        
        # Save the file
        audio_file = AudioFile(file=file)
        audio_file.save()

        # Return a success response
        return JsonResponse({
            "message": "File uploaded successfully",
            "file_url": audio_file.file.url  # URL to access the uploaded file
        }, status=201)
def recognize_from_file(file_path):
    r = sr.Recognizer()
    
    try:
        with sr.AudioFile(file_path) as source:
            print("Processing file.....")
            audio = r.record(source)  # Capture the entire audio file
            print("Recognizing......")
            text = r.recognize_google(audio, language='en-in').lower()  # Convert to lowercase for consistency
            print(f"Recognized Text: {text}\n")
            
            # Split the recognized text into individual words
            words = text.split()
            print(f"Split Words: {words}")
            # Check if "help" or "danger" is present in the words
            if "help" in words or "danger" in words:
                print("Danger!")
            else:
                print("No keywords detected.")
    except Exception as e:
        print(f"Error: {e}")
        print("Unable to recognize speech from the file.")

# Example: Use the path to your .wav file here
