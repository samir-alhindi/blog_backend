

from rest_framework.reverse import reverse

from .models import Post, PostReaction
from rest_framework import serializers

class PostSerializer(serializers.HyperlinkedModelSerializer):

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True
    )

    comments_url = serializers.SerializerMethodField()
    reactions_url = serializers.SerializerMethodField()

    def get_comments_url(self, obj):
        request = self.context.get('request')
        return reverse(
            'post-comments-list',
            kwargs={'post_pk' : obj.pk},
            request=request
        )
    
    def get_reactions_url(self, obj):
        request = self.context.get('request')
        return reverse(
            'post-reactions-list',
            kwargs={'post_pk' : obj.pk},
            request=request
        )
    class Meta:
        model = Post
        fields = ['url', 'title', 'body', 'image', 'creation_date', 'author', 'comments_url', 'reactions_url']
    
class PostReactionSerializers(serializers.HyperlinkedModelSerializer):

    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        request = self.context.get('request')
        return reverse(
            'post-reactions-detail',
            kwargs={'post_pk' : obj.post.pk, 'pk' : obj.pk},
            request=request
        )

    class Meta:
        model = PostReaction
        fields = ['url', 'author', 'reaction_type', 'created_at', 'post']
        read_only_fields = ['post', 'author']