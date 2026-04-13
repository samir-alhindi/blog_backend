from .models import Comment, CommentReaction
from rest_framework import serializers
from rest_framework.reverse import reverse

class CommentSerializer(serializers.HyperlinkedModelSerializer):

    url = serializers.SerializerMethodField()
    reactions_url = serializers.SerializerMethodField()

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
    
    def get_reactions_url(self, obj):
        request = self.context.get('request')
        return reverse(
            'comment-reactions-list',
            kwargs={
                'post_pk' : obj.post.pk,
                'comment_pk' : obj.pk,
                },
            request=request
        )

    class Meta:
        model = Comment
        fields = ['url', 'post', 'author', 'creation_date', 'body', 'reactions_url']

class CommentReactionSerializer(serializers.HyperlinkedModelSerializer):

    comment = serializers.SerializerMethodField()

    def get_comment(self, obj):
        request = self.context.get('request')
        return reverse(
            'post-comments-list',
            kwargs={'post_pk' : obj.comment.post.pk},
            request=request
        )

    class Meta:
        model = CommentReaction
        fields = ['author', 'reaction_type', 'created_at', 'comment']
        read_only_fields  = ['author', 'comment']