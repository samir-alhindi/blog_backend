from django.db.models import Count
from django.shortcuts import render
from rest_framework import generics
from core.permissions import IsAuthor
from posts.models import Post
from . import serializers
from rest_framework.permissions import IsAuthenticated

def get_deleted_posts_queryset(self):
        return (Post.deleted_objects
                .filter(author=self.request.user)
                .select_related('author')
                .annotate(
                    reactions_count=Count('reactions', distinct=True),
                    comments_count=Count('comments', distinct=True),
                    bookmarks_count=Count('bookmarks', distinct=True),
            )
        )

# Create your views here.
class DeletedPostListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAuthor]
    serializer_class = serializers.DeletedPostListSerializer

    def get_queryset(self):
         return get_deleted_posts_queryset(self)

class DeletedPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'slug'
    permission_classes = [IsAuthenticated, IsAuthor]
    serializer_class = serializers.DeletedPostDetailSerializer

    def get_queryset(self):
        return get_deleted_posts_queryset(self)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return serializers.DeletedPostUpdateSerializer
        return serializers.DeletedPostDetailSerializer