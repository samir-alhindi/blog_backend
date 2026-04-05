from .models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'bio', 'avatar', 'posts',]
    
class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password', 'bio', 'avatar']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)