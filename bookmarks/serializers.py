
from rest_framework import serializers
from .models import Bookmark
from posts.models import Post

class _BookmarkSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        read_only=True,
    )

class BookmarkCreateSerializer(_BookmarkSerializer):

    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        lookup_field='slug',
        queryset=Post.objects.all(),
    )

    def validate(self, attrs):

        user = self.context['request'].user

        if not user:
            raise serializers.ValidationError('Must login to bookmark posts')

        if Bookmark.objects.filter(post= attrs['post'], user=user).exists():
            raise serializers.ValidationError('post is already bookmarked')
        

        return super().validate(attrs)

    class Meta:
        fields = ['id', 'url', 'creation_date', 'post', 'user']
        model = Bookmark
    
class BookmarkSerializer(_BookmarkSerializer):

    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        lookup_field='slug',
        read_only=True,
    )

    class Meta:
        fields = ['url', 'id', 'creation_date', 'post', 'user']
        read_only = '__all__'
        model = Bookmark