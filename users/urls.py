
from django.urls import path

from . import views

urlpatterns = [
    path('', views.UserList.as_view(), name='user-list'),
    path('<str:username>/', views.UserDetail.as_view(), name='user-detail'),

    path('<str:username>/follows/', views.FollowerList.as_view(), name='follower-list'),

    path('<str:username>/following/', views.FollowingList.as_view(), name='following-list'),
    path('<str:username>/following/<str:following_username>/', views.FollowingDetail.as_view(), name='following-detail'),
]