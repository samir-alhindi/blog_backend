
from django.db.models import Count
from rest_framework import permissions, generics
from . import serializers
from .models import Post, PostReaction
from core.permissions import IsAuthorOrReadOnly
from .filters import PostFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from time_machine import travel
from datetime import datetime
from zoneinfo import ZoneInfo
from core.pagination import StandardPagination

def get_post_queryset(self):
    '''
    returns an optimized query for posts that have not been deleted.
    annotated with counts for the post reactions, comments, and bookmarks.
    '''
    return (Post.objects
            .select_related('author')
            .annotate(
                reactions_count=Count('reactions', distinct=True),
                comments_count=Count('comments', distinct=True),
                bookmarks_count=Count('bookmarks', distinct=True),
        ))

class PostListCreateView(generics.ListCreateAPIView):
    '''
    Used for create/list opperations on posts.
    '''
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_class = PostFilter
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    pagination_class = StandardPagination
    search_fields = ['body', 'title', 'author__username']
    ordering_fields = ['created_at', 'reactions_count', 'comments_count']
    ordering = ['-created_at']

    def get_queryset(self):
        return get_post_queryset(self)

    def get_serializer_class(self):
        return serializers.PostCreateSerializer if self.request.method == 'POST' else serializers.PostListSerializer
        
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    '''
    Used for retrieve/update/delete operations on posts.
    '''
    serializer_class = serializers.PostDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        return get_post_queryset(self)

    def perform_destroy(self, instance):
        instance.deleted_at = datetime.now(ZoneInfo('UTC'))
        instance.save()

def get_reactions_queryset(self):
    '''
    returns an optimized query for a post's reactions.
    fetches the reactions based on the slug in the url.
    for exmaple "api/posts/my-post/reactions/" would return all the reactions on the post "my-post
    '''
    post_slug = self.kwargs['slug']
    return (PostReaction.objects
            .filter(post__slug=post_slug)
            .select_related('post')
            .select_related('author'))

class PostReactionListCreateView(generics.ListCreateAPIView):
    '''
    Used for list/create operations on post reactions.
    '''
    serializer_class = serializers.PostReactionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [OrderingFilter]
    ordering = ['-created_at']
    pagination_class = StandardPagination

    def get_queryset(self):
        return get_reactions_queryset(self)

    def perform_create(self, serializer):
        author = self.request.user
        post = Post.objects.get(slug=self.kwargs['slug'])
        serializer.save(author=author, post=post)

class PostReactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    '''
    Used for retrieve/update/delete operations on post reactions.
    '''
    serializer_class = serializers.PostReactionSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        return get_reactions_queryset(self)