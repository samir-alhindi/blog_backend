
from django.urls import path
from .views import CommentDetailView, CommentListCreateView, CommentReactionDetailView, CommentReactionListCreateView


urlpatterns = [
    path('', CommentListCreateView.as_view(), name='comment-list'),
    path('<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
    
    path('<int:pk>/reactions/', CommentReactionListCreateView.as_view(), name='comment-reaction-list'),
    path('<int:comment_pk>/reactions/<int:pk>/', CommentReactionDetailView.as_view(), name='comment-reaction-detail'),
]