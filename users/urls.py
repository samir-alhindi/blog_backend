
from django.urls import path

from . import views

urlpatterns = [
    path('', views.UserList.as_view(), name='user-list'),
    path('<str:username>/', views.UserDetail.as_view(), name='user-detail'),
    path('<str:username>/password/', views.PasswordUpdateView.as_view(), name='password-detail'),
]