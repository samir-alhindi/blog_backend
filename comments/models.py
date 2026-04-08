from django.db import models
from posts.models import Post
from users.models import User

# Create your models here.
class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

    body = models.TextField()
    creation_date = models.DateField(auto_now=True)