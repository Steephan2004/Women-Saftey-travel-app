from django.contrib import admin
from .models import Complaint,HarassmentReport

# Custom admin interface for Complaint model
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('name', 'mobileNo', 'city', 'subject', 'created_at')
    search_fields = ('name', 'mobileNo', 'city') 
    list_filter = ('city', 'subject') 
    ordering = ('-created_at',)  


admin.site.register(Complaint, ComplaintAdmin)
admin.site.register(HarassmentReport)
