from django.db import models
from users.models import User

# Create your models here.
class Reaction(models.Model):
    class ReactionTypes(models.TextChoices):
        LIKE = 'Like'
        DISLIKE = 'Dislike'
        FUNNY = 'Funny'
        SAD = 'Sad'
        ANGRY = 'Angry'
        SCARY = 'Scary'
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=20, choices=ReactionTypes.choices, default=ReactionTypes.LIKE)
    created_at = models.DateField(auto_now=True)

    class Meta:
        abstract = True
