
from django.db.models import Count
from rest_framework import permissions, generics
from .serializers import PostReactionSerializers, PostSerializer
from .models import Post, PostReaction
from core.permissions import IsAuthorOrReadOnly
from .filters import PostFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filterset_class = PostFilter
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['body', 'title']
    ordering_fields = ['creation_date', 'reactions_count', 'comments_count']

    def get_queryset(self):
        return (Post.objects
                .annotate(reactions_count=Count('reactions'))
                .annotate(comments_count=Count('comments'))
                )

    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    lookup_field = 'slug'
    permission_classes = [
        IsAuthorOrReadOnly
    ]

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