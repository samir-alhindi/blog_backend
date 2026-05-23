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
    
    reaction_type = models.CharField(max_length=20, choices=ReactionTypes.choices, default=ReactionTypes.LIKE)
    created_at = models.DateField(auto_now=True)

    class Meta:
        abstract = True

