from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import generics

from core.pagination import StandardPagination
from .serializers import UserSerializer, UserCreateSerializer
from .permissions import IsUserOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from core.permissions import isMeOrReadOnly
from .models import User

# Create your views here.

def get_user_queryset(self):
    return (User.objects
            .annotate(followers_count=Count('followers', distinct=True))
            .annotate(following_count=Count('following', distinct=True))
    )

class UserList(generics.ListCreateAPIView):
    
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['username', 'bio']
    ordering_fields = ['followers_count', 'following_count', 'date_joined']
    ordering = ['-date_joined']
    pagination_class = StandardPagination

    def get_serializer_class(self): 
        return UserCreateSerializer if self.request.method == 'POST' else UserSerializer
    
    def get_queryset(self):
        return get_user_queryset(self)

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsUserOrReadOnly]
    lookup_field = 'username'

    def get_queryset(self):
        return get_user_queryset(self)