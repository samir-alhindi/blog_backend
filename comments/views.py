from django.shortcuts import render
from rest_framework import generics, viewsets
from .models import Comment
from .serializers import CommentSerializer


class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()