from django.shortcuts import render
from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer

# Create your views here.
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()