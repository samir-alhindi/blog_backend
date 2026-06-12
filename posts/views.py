
from django.db.models import Count
from rest_framework import permissions, generics
from .serializers import PostReactionSerializer, PostListSerializer, PostDetailSerializer, PostCreateSerializer
from .models import Post, PostReaction
from core.permissions import IsAuthorOrReadOnly
from .filters import PostFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from time_machine import travel

def get_post_queryset(self):
    return (Post.objects
            .select_related('author')
            .annotate(
                reactions_count=Count('reactions', distinct=True),
                comments_count=Count('comments', distinct=True)))

class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_class = PostFilter
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['body', 'title', 'author__username']
    ordering_fields = ['creation_datetime', 'reactions_count', 'comments_count']
    ordering = ['-creation_datetime']

    def get_queryset(self):
        return get_post_queryset(self)

    def get_serializer_class(self):
        return PostCreateSerializer if self.request.method == 'POST' else PostListSerializer
        
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostDetailSerializer
    lookup_field = 'slug'
    permission_classes = [
        IsAuthorOrReadOnly
    ]

    def get_queryset(self):
        return get_post_queryset(self)

def get_reactions_queryset(self):
    post_slug = self.kwargs['slug']
    return (PostReaction.objects
            .filter(post__slug=post_slug)
            .select_related('post')
            .select_related('author'))

class PostReactionListCreateView(generics.ListCreateAPIView):
    serializer_class = PostReactionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [OrderingFilter]
    ordering = ['-creation_datetime']

    def get_queryset(self):
        return get_reactions_queryset(self)

    def perform_create(self, serializer):
        author = self.request.user
        post = Post.objects.get(slug=self.kwargs['slug'])
        serializer.save(author=author, post=post)

class PostReactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostReactionSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        return get_reactions_queryset(self)