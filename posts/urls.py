
from django.urls import path

from . import views
from comments.views import PostCommentsList

urlpatterns = [
    path('', views.PostList.as_view(), name='post-list'),
    path('<int:pk>/', views.PostDetail.as_view(), name='post-detail'),
    path('<int:pk>/comments/', PostCommentsList.as_view(), name='post-comments-list')
]