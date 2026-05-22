
from rest_framework import permissions, generics
from .serializers import PostReactionSerializers, PostSerializer
from .models import Post, PostReaction
from core.permissions import IsAuthorOrReadOnly

class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    lookup_field = 'slug'

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
    queryset = PostReaction.objects.all()