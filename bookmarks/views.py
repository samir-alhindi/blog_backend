from django.shortcuts import render

from bookmarks.models import Bookmark
from . import serializers
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class BookmarkListCreateView(ListCreateAPIView):
    serializer_class = serializers.BookmarkCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

class BookmarkDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.BookmarkSerializer

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)