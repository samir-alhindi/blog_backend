from django.db import IntegrityError

from django.db import models
from django.utils.text import slugify
from reactions.models import Reaction
from users.models import User
import uuid

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    body = models.TextField()
    image = models.ImageField(upload_to='posts/', null=True)
    creation_datetime = models.DateTimeField(auto_now_add=True)
    last_edit_datetime = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs) -> None:
        if self.slug:
            return super().save(*args, **kwargs)
        for _ in range(10):
            try:
                self.slug = f'{slugify(self.title)[:246]}-{uuid.uuid4().hex[:8]}'
                return super().save(*args, **kwargs)
            except IntegrityError:
                self.slug = None
        raise RuntimeError(f'Could not generate unique slug for post {self.title}')

    def __str__(self) -> str:
        return self.slug or self.title

class PostReaction(Reaction):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_reactions')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                fields=['author', 'post'],
                name='author_post_reaction',
            )
        ]
    
    def __str__(self) -> str:
        return f'{self.reaction_type} reaction by {self.author} on "{self.post}"'