from django.db import models
from users.models import User
from reactions.models import Reaction

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')

    title = models.CharField()
    body = models.TextField()
    image = models.ImageField(upload_to='posts/', null=True)
    creation_date = models.DateField(auto_now=True)

    def __str__(self) -> str:
        return self.title

class PostReaction(Reaction):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')