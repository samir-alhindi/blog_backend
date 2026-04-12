

from .models import Post
from rest_framework import serializers

class PostSerializer(serializers.HyperlinkedModelSerializer):

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True
    )

    comments = serializers.HyperlinkedRelatedField(
        view_name='comment-detail',
        read_only=True,
        many=True,
    )

    class Meta:
        model = Post
        fields = ['url', 'title', 'body', 'image', 'creation_date', 'author', 'comments']