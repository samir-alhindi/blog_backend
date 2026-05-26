from django_filters import rest_framework as filters
from .models import Comment

class CommentFilter(filters.FilterSet):
    class Meta:
        model = Comment
        fields = {
            'author' : ['exact'],
            'post' : ['exact'],
            'parent' : ['exact'],
            'creation_date' : ['exact', 'lt', 'gt'],
        }