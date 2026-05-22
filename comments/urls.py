
from django.urls import path
from .views import CommentDetail, CommentList, CommentReactionDetail, CommentReactionList


urlpatterns = [
    path('', CommentList.as_view(), name='comment-list'),
    path('<int:pk>/', CommentDetail.as_view(), name='comment-detail'),
    
    path('<int:pk>/reactions/', CommentReactionList.as_view(), name='comment-reaction-list'),
    path('<int:comment_pk>/reactions/<int:pk>/', CommentReactionDetail.as_view(), name='comment-reaction-detail'),
]