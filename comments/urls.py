
from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>', views.CommentDetail.as_view(), name='comment-detail')
]