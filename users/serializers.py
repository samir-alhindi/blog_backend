from .models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):

    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'bio', 'avatar']