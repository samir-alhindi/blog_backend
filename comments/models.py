from django.db import models
from posts.models import Post
from reactions.models import Reaction
from users.models import User

class CommentManager(models.Manager):
    '''
    Manager for comments.
    '''
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(post__deletion_datetime=None)

# Create your models here.
class Comment(models.Model):
    '''
    Represents a user written comment on a blog post.
    '''
    objects = CommentManager()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True)

    body = models.TextField()
    creation_datetime = models.DateTimeField(auto_now_add=True)
    last_edit_datetime = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f'Comment {self.pk} by user {self.author} on post "{self.post}"'

class CommentReaction(Reaction):
    '''
    Represents an author's reaction (Joy, Sadness, Anger...) to a comment.
    '''
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_reactions')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='reactions')

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                fields=['author', 'comment'],
                name='author_comment_reaction',
            )
        ]

    def __str__(self) -> str:
        return f'{self.reaction_type} reaction by user {self.author} on {self.comment}'