from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import generics

from core.pagination import StandardPagination
from .models import Comment, CommentReaction
from .serializers import CommentDetailSerializer, CommentReactionSerializer, CommentListSerializer, CommentCreateSerializer
from rest_framework import permissions
from core.permissions import IsAuthorOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .filters import CommentFilter

def get_comment_queryset(self):
    return (Comment.objects
            .select_related('author')
            .select_related('parent')
            .annotate(
                reactions_count=Count('reactions', distinct=True),
                replies_count=Count('replies', distinct=True)
            )
            
    )

class CommentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_class = CommentFilter
    pagination_class = StandardPagination
    search_fields = ['body', 'author__username', 'post__title']
    ordering_fields = ['creation_date', 'reactions_count', 'replies_count']
    ordering = ['-creation_datetime']
    pagination_class = StandardPagination

    def get_queryset(self):
        return get_comment_queryset(self)
    
    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)
    
    def get_serializer_class(self):
        return CommentCreateSerializer if self.request.method == 'POST' else CommentListSerializer

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentDetailSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        return get_comment_queryset(self)

def get_reaction_queryset(self):
    comment_pk = self.kwargs['pk']
    return (CommentReaction.objects.
            filter(comment__pk=comment_pk)
            .order_by('-creation_datetime')
            .select_related('author')
            .select_related('comment'))

class CommentReactionListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentReactionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardPagination

    def get_queryset(self):
        return get_reaction_queryset(self)
    
    def perform_create(self, serializer):
        author = self.request.user
        comment = get_object_or_404(Comment, pk=self.kwargs['pk'])
        serializer.save(author=author, comment=comment)

class CommentReactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentReactionSerializer
    permission_classes = [IsAuthorOrReadOnly]
    
    def get_queryset(self):
        return get_reaction_queryset(self)