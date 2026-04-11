from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework import permissions

from .models import User
from .serializers import UserSerializer, CreateUserSerializer
from .permissions import IsUserOrReadOnly

# Create your views here.

class UserList(generics.ListCreateAPIView):
    serializer_class = CreateUserSerializer
    queryset = User.objects.all()

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [
        IsUserOrReadOnly
    ]