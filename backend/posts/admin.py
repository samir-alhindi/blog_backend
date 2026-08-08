from django.contrib import admin
from .models import Post, PostReaction

# Register your models here.
admin.site.register([Post, PostReaction])