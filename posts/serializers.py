

from .models import Post
from rest_framework import serializers

class PostSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Post
        fields = ['url', 'title', 'body', 'image', 'creation_date', 'author', 'comments']