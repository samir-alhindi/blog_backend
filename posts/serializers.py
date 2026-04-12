

from rest_framework.reverse import reverse

from .models import Post
from rest_framework import serializers

class PostSerializer(serializers.HyperlinkedModelSerializer):

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True
    )

    comments_url = serializers.SerializerMethodField()

    def get_comments_url(self, obj):
        request = self.context.get('request')
        return reverse(
            'post-comments-list',
            kwargs={'post_pk' : obj.pk},
            request=request
        )

    class Meta:
        model = Post
        fields = ['url', 'title', 'body', 'image', 'creation_date', 'author', 'comments_url']