
from django.urls import path

from . import views

urlpatterns = [
    path('', views.PostListCreateView.as_view(), name='post-list'),
    path('<slug:slug>/', views.PostDetailView.as_view(), name='post-detail'),

    path('<slug:slug>/reactions/', views.PostReactionListCreateView.as_view(), name='post-reaction-list'),
    path('<slug:slug>/reactions/<int:pk>/', views.PostReactionDetailView.as_view(), name='post-reaction-detail'),
]