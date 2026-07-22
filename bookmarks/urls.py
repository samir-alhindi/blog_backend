
from . import views
from django.urls import path

urlpatterns = [
    path('', view=views.BookmarkListCreateView.as_view(), name='bookmark-list'),
    path('<int:pk>/', view=views.BookmarkDetailView.as_view(), name='bookmark-detail'),
]
