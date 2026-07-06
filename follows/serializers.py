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

    class Meta:
        model = Follow
        fields = ['url', 'id', 'from_user', 'to_user', 'creation_date']