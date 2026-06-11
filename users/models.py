from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True)
    following = models.ManyToManyField(
        'self',
        through='users.Follow',
        related_name='followers',
        symmetrical=False,
    )

class Follow(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_relations')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower_relations')
    creation_date = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['from_user', 'to_user'],
                name='unique_follow'
            )
        ]