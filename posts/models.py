from django.db import models
from users.models import User

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')

    title = models.CharField()
    body = models.TextField()
    image = models.ImageField(upload_to='posts/', null=True)
    creation_date = models.DateField(auto_now=True)