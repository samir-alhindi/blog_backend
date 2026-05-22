
from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import Comment, CommentReaction
from .serializers import CommentReactionSerializer, CommentSerializer
from rest_framework import permissions
from core.permissions import IsAuthorOrReadOnly

class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Comment.objects.all()
    
    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = [IsAuthorOrReadOnly]

class CommentReactionList(generics.ListCreateAPIView):
    serializer_class = CommentReactionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        comment_pk = self.kwargs['pk']
        return CommentReaction.objects.filter(comment__pk=comment_pk)
    
    def perform_create(self, serializer):
        author = self.request.user
        comment = Comment.objects.get(pk=self.kwargs['pk'])
        serializer.save(author=author, comment=comment)

class CommentReactionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentReactionSerializer
    permission_classes = [IsAuthorOrReadOnly]
    queryset = CommentReaction.objects.all()