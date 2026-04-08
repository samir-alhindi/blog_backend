

from .models import Post
from rest_framework import serializers

class PostSerializer(serializers.HyperlinkedModelSerializer):

    author = serializers.HyperlinkedRelatedField(read_only=True, view_name='user-detail')
    comments = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='comment-detail'
    )

    class Meta:
        model = Post
        fields = '__all__'