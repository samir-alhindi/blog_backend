from django_filters import rest_framework as filters
from .models import Post

class PostFilter(filters.FilterSet):
    class Meta:
        model = Post
        fields = {
            'author' : ['exact'],
            'author__username' : ['exact'],
            'slug' : ['exact'],
            'creation_date' : ['exact', 'lt', 'gt'],
        }