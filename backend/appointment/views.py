from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from .serializers import UserSerializer, LogInSerializer
from .models import speciality, doctors, appointments
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.utils import json
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.contrib.auth.base_user import BaseUserManager

import requests
# Create your views here.

class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

class LogInView(TokenObtainPairView):
    serializer_class = LogInSerializer

class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class ValidateToken(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return JsonResponse({"message": "validuser"}, status=200)



class CreateAppointment(APIView):
    def post(self, request):
        timings = request.data.get("timings", None)
        date = request.data.get("date", None)
        doctor_id = "1"
        user_data = request.user
        doctor_data = doctors.objects.get(id=int(doctor_id))

        status = appointments.objects.create(appointments_user=user_data,
                                             appointments_date=date,
                                             appointments_time=timings,
                                             appointments_doctor=doctor_data)

        if status.id:
            status.save()
            return JsonResponse({"message": "Appointment has been booked"})

class Deleteappointment(APIView):
    def post(self, request):
        id = request.data.get("id", None)
        user_data = request.user

        status = appointments.objects.filter(appointments_user=user_data,
                                             id=id).delete()
        if status[0] == 1:
            return JsonResponse({"message": "Appointment has been successfully deleted"})


class GetAppontmentDetails(APIView):
    def get(self, request):
        user_data = request.user
        appointment_list = []
        appointment_data = appointments.objects.filter(appointments_user=user_data)
        for each_appointment in appointment_data:
            doctor_obj = each_appointment.appointments_doctor
            appointment_list.append({"name": str(doctor_obj.doctor_name),
                                     "speciality": str(doctor_obj.doctor_speciality),
                                     "date": str(each_appointment.appointments_date),
                                     "time": str(each_appointment.appointments_time),
                                     "id": str(each_appointment.id)})
        return JsonResponse({"data": appointment_list})


class ListDoctors(APIView):
    def post(self, request):
        speciality_name = request.data.get("specality", None)
        timings = request.data.get("timings", None)
        date = request.data.get("date", None)
        speciality_data = speciality.objects.get(speciality_name=speciality_name)
        doctors_list =  doctors.objects.filter(doctor_speciality=speciality_data)
        available_doctors = []
        for each_doctor in doctors_list:
            doctor_appointments = appointments.objects.filter(appointments_doctor=each_doctor,appointments_time=timings, appointments_date=date)
            if len(doctor_appointments) == 0:
                available_doctors.append({"name": each_doctor.doctor_name, "speciality":each_doctor.doctor_speciality.speciality_name, "id": str(each_doctor.id)})

        return JsonResponse({"data": available_doctors})

class GoogleView(APIView):
    def post(self, request):
        payload = {'access_token': request.data.get("token")}  # validate the token
        r = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', params=payload)
        data = json.loads(r.text)

        if 'error' in data:
            content = {'message': 'wrong google token / this google token is already expired.'}
            return Response(content)

        # create user if not exist
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            user = User()
            user.username = data['email']
            # provider random default password
            user.password = make_password(BaseUserManager().make_random_password())
            user.email = data['email']
            user.save()

        token = RefreshToken.for_user(user)  # generate token without username & password
        response = {}
        response['username'] = user.username
        response['access_token'] = str(token.access_token)
        response['refresh_token'] = str(token)
        return Response(response)






