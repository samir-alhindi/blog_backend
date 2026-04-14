
from django.urls import path


from comments.views import PostCommentsList, CommentDetail, CommentReactionsList, CommentReactionsDetail
from .views import PostDetail, PostList, PostReactionsDetail, PostReactionsList

urlpatterns = [
    path('', PostList.as_view(), name='post-list'),
    path('<int:pk>/', PostDetail.as_view(), name='post-detail'),

    path('<int:post_pk>/comments/', PostCommentsList.as_view(), name='post-comments-list'),
    path('<int:post_pk>/comments/<int:pk>/', CommentDetail.as_view(), name='post-comments-detail'),

    path('<int:post_pk>/reactions/', PostReactionsList.as_view(), name='post-reactions-list'),
    path('<int:post_pk>/reactions/<int:pk>/', PostReactionsDetail.as_view(), name='post-reactions-detail'),

    path('<int:post_pk>/comments/<int:comment_pk>/reactions/', CommentReactionsList.as_view(), name='comment-reactions-list'),
    path('<int:post_pk>/comments/<int:comment_pk>/reactions/<int:pk>', CommentReactionsDetail.as_view(), name='comment-reactions-detail'),
    
]