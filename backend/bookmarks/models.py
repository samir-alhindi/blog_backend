from django.db import models
from posts.models import Post
from users.models import User

# Create your models here.
class Bookmark(models.Model):
    creation_date = models.DateField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                fields=('post', 'user'),
                name='unique_bookmark',
            )
        ]
    
    def __str__(self) -> str:
        return f'{self.user.username} saved {self.post.title}'