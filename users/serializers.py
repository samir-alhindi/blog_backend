from .models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    posts = serializers.HyperlinkedRelatedField(
        read_only=True,
        many=True,
        view_name='post-detail',
        lookup_field='slug'
    )
    class Meta:
        model = User
        fields = ['url', 'username', 'bio', 'avatar', 'posts',]
    
class CreateUserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['url','username', 'password', 'bio', 'avatar']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)