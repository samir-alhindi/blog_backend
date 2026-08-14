
from posts.models import Post
from posts.serializers import _PostBaseSerializer
from rest_framework import serializers


class DeletedPostListSerializer(_PostBaseSerializer):
    '''
    Used for list opperations on deleted posts.
    '''
    url = serializers.HyperlinkedIdentityField(
        view_name='deleted-post-detail',
        lookup_field='slug',
    )

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug',  'image', 'author',
                  'created_at', 'comments_count', 'bookmarks_count',
                  'reactions_count', 'deleted_at']

class DeletedPostRetrieveDestroySerializer(_PostBaseSerializer):
    '''
    Used for retrieve/delete operations on deleted posts.
    '''
    url = serializers.HyperlinkedIdentityField(
        view_name='deleted-post-detail',
        lookup_field='slug',
    )

    def validate_deleted_at(self, value):
        if value is not None:
            raise serializers.ValidationError(
                'you cannot manually set a deletion timestamp. Set to null to restore.'
            )
        return value

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug', 'body', 'image', 'author', 'created_at',
                  'last_edit_datetime', 'comments_count',
                  'reactions_count', 'deleted_at',
                ]
        read_only_fields = ['slug']

class DeletedPostUpdateSerializer(_PostBaseSerializer):
    '''
    Used for update operations on deleted posts.
    '''
    url = serializers.HyperlinkedIdentityField(
        view_name='post-detail',
        lookup_field='slug',
    )

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug', 'body', 'image', 'author', 'created_at',
                  'last_edit_datetime', 'comments_count',
                  'reactions_count', 'deleted_at',
                ]
        read_only_fields = ['slug']