from django.db import models
from django.utils.text import slugify
from reactions.models import Reaction
from users.models import User

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')

    title = models.CharField()
    slug = models.SlugField(unique=True, blank=True)
    body = models.TextField()
    image = models.ImageField(upload_to='posts/', null=True)
    creation_date = models.DateField(auto_now=True)

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            import string, random
            self.slug = slugify(self.title)
            while Post.objects.filter(slug=self.slug).exists():
                suffix = '-' + ''.join(random.choices(string.ascii_letters + string.digits, k=5))
                self.slug = slugify(self.title + suffix)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.slug

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