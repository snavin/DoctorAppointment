from django.db import models

# Create your models here.
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User

# class User(AbstractUser):
#     username =  models.CharField(max_length=60, unique=True)
#     first_name = models.CharField(max_length=30, blank=True)
#     last_name = models.CharField(max_length=30, blank=True)

#     def __str__(self):
#         return str(self.username)



class speciality(models.Model):
    speciality_name = models.CharField(max_length=100)

    def __str__(self):
        return self.speciality_name

class doctors(models.Model):
    doctor_name = models.CharField(max_length=100)
    doctor_speciality = models.ForeignKey(speciality, default="general", on_delete=models.SET_DEFAULT)

    def __str__(self):
        return self.doctor_name

class appointments(models.Model):
    appointments_user = models.ForeignKey(User, on_delete=models.CASCADE)
    appointments_date = models.DateField()
    appointments_doctor = models.ForeignKey(doctors, on_delete=models.CASCADE)
    appointments_time = models.CharField(max_length=10)

    def __str__(self):
        return str(self.id)

