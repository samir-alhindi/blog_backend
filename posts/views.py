from django.shortcuts import get_object_or_404, render
from rest_framework import permissions, generics

from .serializers import PostSerializer, PostReactionSerializers
from .models import Post, PostReaction
from core.permissions import IsAuthorOrReadOnly

class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'

    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        IsAuthorOrReadOnly
    ]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'

class PostReactionsList(generics.ListCreateAPIView):
    serializer_class = PostReactionSerializers
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        slug = self.kwargs['slug']
        post = get_object_or_404(Post, slug=slug)
        return post.reactions # type: ignore
    
    def perform_create(self, serializer):
        slug = self.kwargs['slug']
        post = get_object_or_404(Post, slug=slug)
        author = self.request.user
        serializer.save(author=author, post=post)

class PostReactionsDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostReactionSerializers
    permission_classes = [IsAuthorOrReadOnly]

    def get_object(self): # type: ignore
        reaction_pk = self.kwargs['pk']
        reaction = get_object_or_404(PostReaction, pk=reaction_pk)
        return reaction