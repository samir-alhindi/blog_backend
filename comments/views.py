from django.shortcuts import get_object_or_404, render
from rest_framework import generics, viewsets

from posts.models import Post
from .models import Comment
from .serializers import CommentSerializer
from rest_framework import permissions
from core.permissions import IsAuthorOrReadOnly

class PostCommentsList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        author = self.request.user
        post_pk = self.kwargs['post_pk']
        post = get_object_or_404(Post, pk=post_pk)
        return serializer.save(author=author, post=post)
    
    def get_queryset(self): # type: ignore
        return Comment.objects.filter(post__pk=self.kwargs['post_pk'])

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = [IsAuthorOrReadOnly]