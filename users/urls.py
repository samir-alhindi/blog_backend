
from django.urls import path

from . import views

urlpatterns = [
    path('', views.UserList.as_view(), name='user-list'),
    path('<str:username>/', views.UserDetail.as_view(), name='user-detail')
]