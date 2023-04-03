from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

from .models import User, speciality, doctors, appointments


# @admin.register(User)
# class UserAdmin(DefaultUserAdmin):
#     pass

admin.site.register(speciality)
admin.site.register(doctors)
admin.site.register(appointments)