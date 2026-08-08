
from django.urls import path

from .views import FollowList, FollowDetail

urlpatterns = [
    path('', FollowList.as_view(), name='follow-list'),
    path('<int:pk>/', FollowDetail.as_view(), name='follow-detail')
]