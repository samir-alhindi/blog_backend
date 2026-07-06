
from .models import User
from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth import login

class UserSerializer(serializers.HyperlinkedModelSerializer):

    followers_count = serializers.BigIntegerField(read_only=True)
    following_count = serializers.BigIntegerField(read_only=True)
    
    url = serializers.HyperlinkedIdentityField(
        view_name='user-detail',
        lookup_field='username'
    )

    posts = serializers.SerializerMethodField()
    def get_posts(self, obj):
        request = self.context['request']
        return reverse(
            viewname='post-list',
            request=request,
            query={
                'author_username' : obj.username
            }
        )
    
    comments = serializers.SerializerMethodField()
    def get_comments(self, obj):
        request = self.context['request']
        return reverse(
            viewname='comment-list',
            request=request,
            query={
                'author_username' : obj.username
            }
        )
    
    followers = serializers.SerializerMethodField()
    def get_followers(self, obj):
        request = self.context['request']
        return reverse(
            viewname='follow-list',
            request=request,
            query={'destination_username' : obj.username},
        )
    
    following = serializers.SerializerMethodField()
    def get_following(self, obj):
        request = self.context['request']
        return reverse(
            viewname='follow-list',
            request=request,
            query={'source_username' : obj.username},
        )
    
    class Meta:
        model = User
        fields = [
            'url', 'username', 'id', 'bio', 'avatar',
            'posts', 'comments',
            'followers_count', 'following_count',
            'followers', 'following'
            ]

class UserCreateSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='user-detail',
        lookup_field='username'
    )
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['url','username', 'password', 'bio', 'avatar']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        login(self.context['request'], user)
        return user