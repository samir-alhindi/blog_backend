
from django.urls import path

from .views import PostDetailView, PostListCreateView, PostReactionListCreateView, PostReactionDetailView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list'),
    path('<slug:slug>/', PostDetailView.as_view(), name='post-detail'),

    path('<slug:slug>/reactions/', PostReactionListCreateView.as_view(), name='post-reaction-list'),
    path('<slug:slug>/reactions/<int:pk>/', PostReactionDetailView.as_view(), name='post-reaction-detail'),
]