from .models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):

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
    
    class Meta:
        model = User
        fields = ['url', 'username', 'bio', 'avatar', 'posts', 'following', 'followers']

class CreateUserSerializer(serializers.HyperlinkedModelSerializer):
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