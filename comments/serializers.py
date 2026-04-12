from .models import Comment
from rest_framework import serializers
from rest_framework.reverse import reverse

class CommentSerializer(serializers.HyperlinkedModelSerializer):

    url = serializers.SerializerMethodField()

    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        read_only=True,
    )
    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True
    )

    def get_url(self, obj):
        request = self.context.get('request')
        return reverse(
            'post-comments-detail',
            kwargs={
                'post_pk' : obj.post.pk,
                'pk' : obj.pk
            },
            request=request
        )

    class Meta:
        model = Comment
        fields = ['url', 'post', 'author', 'creation_date', 'body']