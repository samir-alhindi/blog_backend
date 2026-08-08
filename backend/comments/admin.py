from django.contrib import admin

from comments.models import Comment, CommentReaction

# Register your models here.
admin.site.register([Comment, CommentReaction])