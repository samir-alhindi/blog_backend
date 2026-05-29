
from django.db.models import Count
from django.db import IntegrityError
from rest_framework import permissions, generics
from .serializers import PostReactionSerializers, PostListSerializer, PostDetailSerializer
from .models import Post, PostReaction
from core.permissions import IsAuthorOrReadOnly
from .filters import PostFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from time_machine import travel

class PostList(generics.ListCreateAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_class = PostFilter
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['body', 'title', 'author__username']
    ordering_fields = ['creation_datetime', 'reactions_count', 'comments_count']
    ordering = ['-creation_datetime']

    def get_queryset(self):
        return (Post.objects
                .select_related('author')
                .annotate(
                    reactions_count=Count('reactions', distinct=True),
                    comments_count=Count('comments', distinct=True)))
        

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostDetailSerializer
    lookup_field = 'slug'
    permission_classes = [
        IsAuthorOrReadOnly
    ]

    def get_queryset(self):
        return (Post.objects
                .prefetch_related('reactions', 'comments')
                .select_related('author')
                .annotate(
                    reactions_count=Count('reactions', distinct=True),
                    comments_count=Count('comments', distinct=True)))

class PostReactionList(generics.ListCreateAPIView):
    serializer_class = PostReactionSerializers
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_slug = self.kwargs['slug']
        return PostReaction.objects.filter(post__slug=post_slug)

    def perform_create(self, serializer):
        author = self.request.user
        post = Post.objects.get(slug=self.kwargs['slug'])
        serializer.save(author=author, post=post)

class PostReactionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostReactionSerializers
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        post_slug = self.kwargs['slug']
        return PostReaction.objects.filter(post__slug=post_slug)