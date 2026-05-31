from django_filters import rest_framework as filters


class CommentFilter(filters.FilterSet):

    author_username = filters.CharFilter(
        field_name='author__username',
        lookup_expr='exact',
        label='Author Username'
    )

    author_id = filters.NumberFilter(
        field_name='author__id',
        lookup_expr='exact',
        label='Author ID'
    )

    post_slug = filters.CharFilter(
        field_name='post__slug',
        lookup_expr='exact',
        label='Post Slug'
    )

    post_id = filters.NumberFilter(
        field_name='post__id',
        lookup_expr='exact',
        label='Post ID'
    )

    parent_comment_id = filters.NumberFilter(
        field_name='parent__id',
        lookup_expr='exact',
        label='Parent Comment ID'
    )