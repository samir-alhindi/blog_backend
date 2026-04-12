from django.shortcuts import render
from rest_framework import generics

from .models import User
from .serializers import UserSerializer, CreateUserSerializer
from .permissions import IsUserOrReadOnly

# Create your views here.

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()

    def get_serializer_class(self): #type: ignore
        return CreateUserSerializer if self.request.method == 'POST' else UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [
        IsUserOrReadOnly
    ]