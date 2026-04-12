from .models import Comment
from rest_framework import serializers

class CommentSerializer(serializers.HyperlinkedModelSerializer):

    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        read_only=True,
    )
    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True
    )

    class Meta:
        model = Comment
        fields = ['url', 'post', 'author', 'creation_date', 'body']