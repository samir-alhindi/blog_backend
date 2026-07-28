
from posts.models import Post
from posts.serializers import _PostBaseSerializer
from rest_framework import serializers


class DeletedPostListSerializer(_PostBaseSerializer):

    url = serializers.HyperlinkedIdentityField(
        view_name='deleted-post-detail',
        lookup_field='slug',
    )

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug',  'image', 'author',
                  'creation_datetime', 'comments_count', 'bookmarks_count',
                  'reactions_count', 'deletion_datetime']

class DeletedPostDetailSerializer(_PostBaseSerializer):

    url = serializers.HyperlinkedIdentityField(
        view_name='deleted-post-detail',
        lookup_field='slug',
    )

    def validate_deletion_datetime(self, value):
        if value is not None:
            raise serializers.ValidationError(
                'you cannot manually set a deletion timestamp. Set to null to restore.'
            )
        return value

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug', 'body', 'image', 'author', 'creation_datetime',
                  'last_edit_datetime', 'comments_count',
                  'reactions_count', 'deletion_datetime',
                ]
        read_only_fields = ['slug']

class DeletedPostUpdateSerializer(_PostBaseSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='post-detail',
        lookup_field='slug',
    )

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug', 'body', 'image', 'author', 'creation_datetime',
                  'last_edit_datetime', 'comments_count',
                  'reactions_count', 'deletion_datetime',
                ]
        read_only_fields = ['slug']