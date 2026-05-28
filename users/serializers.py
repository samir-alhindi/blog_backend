from .models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):

    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    url = serializers.HyperlinkedIdentityField(
        view_name='user-detail',
        lookup_field='username'
    )

    posts = serializers.HyperlinkedRelatedField(
        read_only=True,
        many=True,
        view_name='post-detail',
        lookup_field='slug'
    )
    
    following = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        queryset=User.objects.all(),
        many=True
    )

    followers = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        many=True,
        read_only=True
    )

    def validate_following(self, value):
        for user in value:
            if self.instance and self.instance.username == user.username:
                raise serializers.ValidationError(f'{self.instance} can\'t follow themselves')
        return value
    
    def get_followers_count(self, obj):
        return len(obj.followers.all())
    
    def get_following_count(self, obj):
        return len(obj.following.all())
    
    class Meta:
        model = User
        fields = ['url', 'username', 'id', 'bio','avatar', 'posts', 'following_count', 'following', 'followers_count', 'followers',]

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
        return User.objects.create_user(**validated_data)