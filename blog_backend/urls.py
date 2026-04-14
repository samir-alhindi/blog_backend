"""
URL configuration for blog_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import URLResolver, include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET', 'HEAD'])
def api_entry_point(request: Request) -> Response:
    '''
    Blog API Entry Point. 
    '''
    return Response({
        'users' : reverse('user-list', request=request),
        'posts' : reverse('post-list', request=request),
    })


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('auth/', include('rest_framework.urls')),
    path('api/', api_entry_point, name='entry-point'),
    path('api/posts/', include('posts.urls')),
    path('api/users/', include('users.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)