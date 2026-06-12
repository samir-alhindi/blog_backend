
from .models import User, Follow
from rest_framework import serializers
from rest_framework.reverse import reverse

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

    
    class Meta:
        model = User
        fields = ['url', 'username', 'id', 'bio','avatar', 'posts', 'followers_count', 'following_count']

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

class FollowerSerializer(serializers.HyperlinkedModelSerializer):

    from_user = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        read_only=True
    )

    class Meta:
        model = Follow
        fields = ['from_user', 'creation_date']

class FollowingListSerializer(serializers.HyperlinkedModelSerializer):

    url = serializers.SerializerMethodField()
    def get_url(self, obj):
        request = self.context['request']
        return reverse(
            viewname='following-detail',
            request=request,
            kwargs={
                'username' : obj.from_user,
                'following_username' : obj.to_user
            }
        )

    to_user = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        queryset=User.objects.all()
    )

    def validate_to_user(self, value):
        me = self.context['request'].user
        if me and me == value:
            raise serializers.ValidationError(f"you can't follow yourself")
        
        if Follow.objects.filter(from_user=me, to_user=value).exists():
            raise serializers.ValidationError(f'Cannot follow {value} twice')
        
        return value
        

    class Meta:
        model = Follow
        fields = ['url', 'to_user', 'creation_date']

class FollowingDetailSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.SerializerMethodField()
    def get_url(self, obj):
        request = self.context['request']
        return reverse(
            viewname='following-detail',
            request=request,
            kwargs={
                'username' : obj.from_user,
                'following_username' : obj.to_user
            }
        )
    
    to_user = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        queryset=User.objects.all()
    )

    class Meta:
        model = Follow
        fields = ['url', 'to_user', 'creation_date']