from django.db.models import Count
from django.shortcuts import render
from rest_framework import generics

from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from .permissions import IsUserOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter

# Create your views here.

class UserList(generics.ListCreateAPIView):
    
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['username', 'bio']
    ordering_fields = ['followers_count', 'following_count', 'date_joined']

    def get_serializer_class(self): 
        return UserCreateSerializer if self.request.method == 'POST' else UserSerializer
    
    def get_queryset(self):
        return (User.objects
                .annotate(followers_count=Count('followers', distinct=True))
                .annotate(following_count=Count('following', distinct=True))
        )

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [
        IsUserOrReadOnly
    ]
    lookup_field = 'username'