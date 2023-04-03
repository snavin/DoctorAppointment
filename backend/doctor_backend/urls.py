"""doctor_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from appointment.views import SignUpView, LogInView, HelloView, ValidateToken,\
    CreateAppointment, ListDoctors, Deleteappointment, GetAppontmentDetails, GoogleView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/sign_up/', SignUpView.as_view(), name='sign_up'),
    path('api/log_in/', LogInView.as_view(), name='log_in'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/test/', HelloView.as_view()),
    path('api/validatetoken/', ValidateToken.as_view()),
    path('api/createappointment/', CreateAppointment.as_view()),
    path('api/listdoctors/', ListDoctors.as_view()),
    path('api/deleteappointment/', Deleteappointment.as_view()),
    path('api/getappointment/', GetAppontmentDetails.as_view()),
    path('api/google/', GoogleView.as_view()),
]
