from rest_framework import serializers
from rest_framework.reverse import reverse
from .models import Follow
from users.models import User

class FollowSerializer(serializers.HyperlinkedModelSerializer):

    from_user = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        read_only=True
    )

    to_user = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        queryset=User.objects.all()
    )

    def validate_to_user(self, value):
        user = self.context['request'].user
        if user == value:
            raise serializers.ValidationError(f'User {user} cannot follow themself.')
        return value
    
    def validate(self, attrs):
        to_user = attrs['to_user']
        from_user = self.context['request'].user
        if Follow.objects.filter(from_user=from_user, to_user=to_user).exists():
            raise serializers.ValidationError(f'User {from_user} is already following User {to_user}')
        return attrs

    class Meta:
        model = Follow
        fields = ['url', 'id', 'from_user', 'to_user', 'creation_date']