
from django.urls import path

from .views import PostDetail, PostList, PostReactionList, PostReactionDetail

urlpatterns = [
    path('', PostList.as_view(), name='post-list'),
    path('<slug:slug>/', PostDetail.as_view(), name='post-detail'),

    path('<slug:slug>/reactions/', PostReactionList.as_view(), name='post-reaction-list'),
    path('<slug:slug>/reactions/<int:pk>/', PostReactionDetail.as_view(), name='post-reaction-detail'),
]