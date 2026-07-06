
from django_filters import rest_framework as filters

class FollowFilter(filters.FilterSet):

    created_before = filters.DateFilter(
        field_name='creation_date',
        lookup_expr='lt',
        label='Created Before',
    )

    created_after = filters.DateFilter(
        field_name='creation_date',
        lookup_expr='lt',
        label='Created After',
    )

    created_at = filters.DateFilter(
        field_name='creation_date',
        lookup_expr='exact',
        label='Created Date',
    )

    source_username = filters.CharFilter(
        field_name='from_user__username',
        lookup_expr='exact',
        label='Source Username',
    )

    destination_username = filters.CharFilter(
        field_name='to_user__username',
        lookup_expr='exact',
        label='Destination Username',
    )

    source_user_id = filters.NumberFilter(
        field_name='from_user__id',
        lookup_expr='exact',
        label='Source User ID'
    )

    destination_user_id = filters.NumberFilter(
        field_name='to_user__id',
        lookup_expr='exact',
        label='Destination User ID'
    )