from django.shortcuts import get_object_or_404, render
from rest_framework import generics, viewsets

from posts.models import Post
from .models import Comment, CommentReaction
from .serializers import CommentSerializer
from rest_framework import permissions
from core.permissions import IsAuthorOrReadOnly

from .serializers import CommentReactionSerializer

class PostCommentsList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        author = self.request.user
        post_pk = self.kwargs['post_pk']
        post = get_object_or_404(Post, pk=post_pk)
        return serializer.save(author=author, post=post)
    
    def get_queryset(self): # type: ignore
        return Comment.objects.filter(post__pk=self.kwargs['post_pk'])

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = [IsAuthorOrReadOnly]

class CommentReactionsList(generics.ListCreateAPIView):
    serializer_class = CommentReactionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_comment(self) -> Comment:
        comment_pk = self.kwargs['comment_pk']
        comment = get_object_or_404(Comment, pk=comment_pk)
        return comment

    def get_queryset(self):
        return self.get_comment().reactions # type: ignore
    
    def perform_create(self, serializer):
        author = self.request.user
        comment = self.get_comment()
        serializer.save(author=author, comment=comment)

class CommentReactionsDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentReactionSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_object(self): # type: ignore
        reaction_pk = self.kwargs['pk']
        reaction = get_object_or_404(CommentReaction, pk=reaction_pk)
        return reaction