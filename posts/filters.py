from django_filters import rest_framework as filters

class PostFilter(filters.FilterSet):

    created_before = filters.IsoDateTimeFilter(
        field_name='creation_datetime',
        lookup_expr= 'lt',
        label='Created Before'
    )

    created_after = filters.IsoDateTimeFilter(
        field_name='creation_datetime',
        lookup_expr='gt',
        label='Created After'
    )

    created_date = filters.DateFilter(
        field_name='creation_datetime',
        lookup_expr='date__exact',
        label='Created Date'
    )

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