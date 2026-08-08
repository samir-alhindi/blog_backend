from django.db.models import Count
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from core.pagination import StandardPagination
from . import serializers
from .permissions import IsUserOrReadOnly, IsUser
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import User

def get_user_queryset(self):
    '''
    returns a query containing every user in the database.
    annotated with counts for followers and followings.
    '''
    return (User.objects
            .annotate(followers_count=Count('followers', distinct=True))
            .annotate(following_count=Count('following', distinct=True))
    )

class UserListCreateView(generics.ListCreateAPIView):
    '''
    Used for list/create opperations on users.
    '''
    
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['username', 'bio']
    ordering_fields = ['followers_count', 'following_count', 'date_joined']
    ordering = ['-date_joined']
    pagination_class = StandardPagination

    def get_serializer_class(self): 
        return serializers.UserCreateSerializer if self.request.method == 'POST' else serializers.UserSerializer
    
    def get_queryset(self):
        return get_user_queryset(self)

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Used for retrieve/update/delete operations on users.
    '''
    serializer_class = serializers.UserSerializer
    permission_classes = [IsUserOrReadOnly]
    lookup_field = 'username'

    def get_queryset(self):
        return get_user_queryset(self)

class PasswordUpdateView(generics.UpdateAPIView):
    '''
    used to change a user's password.
    '''
    serializer_class = serializers.PasswordUpdateSerializer
    permission_classes = [IsUser]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer: PasswordUpdateSerializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user.set_password(serializer.validated_data['new_password'])
            user.save()
        return Response({
                "message": "Password updated successfully."},
                status=status.HTTP_200_OK
        )