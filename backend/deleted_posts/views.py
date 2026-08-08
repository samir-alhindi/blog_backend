from django.db.models import Count
from django.shortcuts import render
from rest_framework import generics
from .permissions import IsAuthor
from posts.models import Post
from . import serializers
from rest_framework.permissions import IsAuthenticated

def get_deleted_posts_queryset(self):
        '''
        returns an optimized query for posts that have been deleted.
        annotated with counts for the post reactions, comments, and bookmarks.
        '''
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
    '''
    Used for list opperations on deleted posts.
    '''
    permission_classes = [IsAuthenticated, IsAuthor]
    serializer_class = serializers.DeletedPostListSerializer

    def get_queryset(self):
         return get_deleted_posts_queryset(self)

class DeletedPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    '''
    Used for retrieve/update/delete operations on deleted posts.
    '''
    lookup_field = 'slug'
    permission_classes = [IsAuthenticated, IsAuthor]

    def get_queryset(self):
        return get_deleted_posts_queryset(self)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return serializers.DeletedPostUpdateSerializer
        return serializers.DeletedPostRetrieveDestroySerializer