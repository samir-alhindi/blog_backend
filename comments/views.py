from django.shortcuts import get_object_or_404, render
from rest_framework import generics, viewsets

from posts.models import Post
from .models import Comment
from .serializers import CommentSerializer

class PostCommentsList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    
    def perform_create(self, serializer):
        author = self.request.user
        post_pk = self.kwargs['pk']
        post = get_object_or_404(Post, pk=post_pk)
        return serializer.save(author=author, post=post)
    
    def get_queryset(self): # type: ignore
        return Comment.objects.filter(post__pk=self.kwargs['pk'])

class CommentList(generics.ListAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()