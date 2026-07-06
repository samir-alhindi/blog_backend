from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Q, F

# Create your models here.
class User(AbstractUser):
    bio = models.TextField(blank=True, max_length=1024)
    avatar = models.ImageField(upload_to='avatars/', null=True)
    following = models.ManyToManyField(
        'self',
        through='follows.Follow',
        related_name='followers',
        symmetrical=False,
    )