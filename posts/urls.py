
from django.urls import path


from comments.views import PostCommentsList, CommentDetail, CommentReactionsList, CommentReactionsDetail
from .views import PostDetail, PostList, PostReactionsDetail, PostReactionsList

urlpatterns = [
    path('', PostList.as_view(), name='post-list'),
    path('<slug:slug>/', PostDetail.as_view(), name='post-detail'),

    path('<slug:slug>/comments/', PostCommentsList.as_view(), name='post-comments-list'),
    path('<slug:slug>/comments/<int:pk>/', CommentDetail.as_view(), name='post-comments-detail'),

    path('<slug:slug>/reactions/', PostReactionsList.as_view(), name='post-reactions-list'),
    path('<slug:slug>/reactions/<int:pk>/', PostReactionsDetail.as_view(), name='post-reactions-detail'),

    path('<slug:slug>/comments/<int:comment_pk>/reactions/', CommentReactionsList.as_view(), name='comment-reactions-list'),
    path('<slug:slug>/comments/<int:comment_pk>/reactions/<int:pk>', CommentReactionsDetail.as_view(), name='comment-reactions-detail'),
    
]