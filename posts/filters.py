from django_filters import rest_framework as filters
from .models import Post

class PostFilter(filters.FilterSet):

    created_before = filters.DateTimeFilter('creation_datetime', 'date__lt', label='Created Before')
    created_after = filters.DateTimeFilter('creation_datetime', 'date__gt', label='Created After')
    created_at = filters.DateTimeFilter('creation_datetime', 'date__exact', label='Created At')

    author_username = filters.CharFilter('author__username', 'exact', label='Author Username')
    author_id = filters.NumberFilter('author__id', 'exact', label='Author ID')