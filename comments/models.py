from django.db import models
from posts.models import Post
from reactions.models import Reaction
from users.models import User

# Create your models here.
class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True)

    body = models.TextField()
    creation_datetime = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f'Comment {self.pk} by user {self.author} on post "{self.post}"'

class CommentReaction(Reaction):
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