from django.shortcuts import render
from rest_framework import permissions, generics
from .serializers import PostSerializer
from .models import Post
from core.permissions import IsAuthorOrReadOnly

class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        IsAuthorOrReadOnly
    ]