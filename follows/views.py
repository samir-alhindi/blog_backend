
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from core.pagination import StandardPagination
from follows.filters import FollowFilter
from follows.models import Follow
from follows.serializers import FollowSerializer

def get_follow_queryset(self):
        return (Follow.objects
                .all()
                .select_related('from_user')
                .select_related('to_user')
        )

class FollowList(ListCreateAPIView):
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_class = FollowFilter
    ordering_fields = ['creation_date']
    ordering = ['-creation_date']
    pagination_class = StandardPagination
    serializer_class = FollowSerializer

    def get_queryset(self):
        return get_follow_queryset(self)
    
    def perform_create(self, serializer):
        return serializer.save(from_user=self.request.user)

class FollowDetail(RetrieveDestroyAPIView):
    serializer_class = FollowSerializer
    
    def get_queryset(self):
        return get_follow_queryset(self)