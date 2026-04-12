
from django.urls import path

from . import views
from comments.views import PostCommentsList, CommentDetail

urlpatterns = [
    path('', views.PostList.as_view(), name='post-list'),
    path('<int:pk>/', views.PostDetail.as_view(), name='post-detail'),
    path('<int:post_pk>/comments/', PostCommentsList.as_view(), name='post-comments-list'),
    path('<int:post_pk>/comments/<int:pk>/', CommentDetail.as_view(), name='post-comments-detail')
]