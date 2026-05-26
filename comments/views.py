
from ast import Or

from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import Comment, CommentReaction
from .serializers import CommentReactionSerializer, CommentSerializer, CommentCreateSerializer
from rest_framework import permissions
from core.permissions import IsAuthorOrReadOnly
from .filters import CommentFilter
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class CommentList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Comment.objects.all()
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['body']
    ordering_fields = ['creation_date', 'reactions_count', 'replies_count']
    filterset_class = CommentFilter

    def get_queryset(self):
        return (Comment.objects
                .annotate(reactions_count=Count('reactions'))
                .annotate(replies_count=Count('replies'))
        )

    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)
    
    def get_serializer_class(self):
        return CommentCreateSerializer if self.request.method == 'POST' else CommentSerializer

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
        comment = get_object_or_404(Comment, pk=self.kwargs['pk'])
        serializer.save(author=author, comment=comment)

class CommentReactionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentReactionSerializer
    permission_classes = [IsAuthorOrReadOnly]
    
    def get_queryset(self):
        comment_pk = self.kwargs['comment_pk']
        return CommentReaction.objects.filter(comment__pk=comment_pk)