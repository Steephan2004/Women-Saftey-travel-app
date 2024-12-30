from django.db import models

class HarassmentReport(models.Model):
    name = models.CharField(max_length=100)
    mobileNumber = models.CharField(max_length=15)
    vehicleNumber = models.CharField(max_length=20)
    problem = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name
class Complaint(models.Model):
    name = models.CharField(max_length=100)
    mobileNo = models.CharField(max_length=15)  # To handle numbers with country codes or special characters
    doorNo = models.CharField(max_length=20)
    streetname = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"

class AudioFile(models.Model):
    file = models.FileField(upload_to='uploads/audio/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audio File {self.id} - {self.file.name}"

    