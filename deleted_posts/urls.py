
from django.urls import path

from . import views

urlpatterns = [
    path('', views.DeletedPostListView.as_view(), name='deleted-post-list'),
    path('<slug:slug>/', views.DeletedPostDetailView.as_view(), name='deleted-post-detail'),
]
