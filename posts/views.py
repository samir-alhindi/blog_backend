from django.shortcuts import get_object_or_404, render
from rest_framework import permissions, generics
from .serializers import PostSerializer, PostReactionSerializers
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

class PostReactionsList(generics.ListCreateAPIView):
    serializer_class = PostReactionSerializers
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_pk = self.kwargs['post_pk']
        post = get_object_or_404(Post, pk=post_pk)
        return post.reactions # type: ignore
    
    def perform_create(self, serializer):
        post_pk = self.kwargs['post_pk']
        post = get_object_or_404(Post, pk=post_pk)
        author = self.request.user
        serializer.save(author=author, post=post)