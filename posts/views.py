from django.shortcuts import render
from rest_framework import permissions, generics
from .serializers import PostSerializer
from .models import Post
from .permissions import IsAuthorOrReadOnly

class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        IsAuthorOrReadOnly
    ]