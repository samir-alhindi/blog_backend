from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import generics

from core.pagination import StandardPagination
from .models import User, Follow
from .serializers import FollowingDetailSerializer, UserSerializer, UserCreateSerializer, FollowerSerializer, FollowingListSerializer
from .permissions import IsUserOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from core.permissions import isMeOrReadOnly

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

class FollowerList(generics.ListAPIView):
    filter_backends = [SearchFilter, OrderingFilter]
    ordering_fields = ['creation_date']
    pagination_class = StandardPagination
    serializer_class = FollowerSerializer

    def get_queryset(self):
        return Follow.objects.filter(to_user__username=self.kwargs['username'])

class FollowingList(generics.ListCreateAPIView):
    filter_backends = [SearchFilter, OrderingFilter]
    ordering_fields = ['creation_date']
    serializer_class = FollowingListSerializer
    pagination_class = StandardPagination
    permission_classes = [isMeOrReadOnly]

    def get_queryset(self):
        return Follow.objects.filter(from_user__username=self.kwargs['username'])
    
    def perform_create(self, serializer):
        return serializer.save(from_user=self.request.user)

class FollowingDetail(generics.RetrieveDestroyAPIView):
    serializer_class = FollowingDetailSerializer
    permission_classes = [isMeOrReadOnly]
    
    lookup_field='to_user__username'
    lookup_url_kwarg='following_username'

    def get_queryset(self):
        return Follow.objects.filter(from_user__username=self.kwargs['username'])
