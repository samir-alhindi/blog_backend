
from django.shortcuts import get_object_or_404
from rest_framework.reverse import reverse

from .models import Comment, CommentReaction, Post
from rest_framework import serializers

class CommentSerializer(serializers.HyperlinkedModelSerializer):

    reactions = serializers.SerializerMethodField()

    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        lookup_field='slug',
        queryset=Post.objects.all()
    )

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True,
        lookup_field='username'
    )

    def get_reactions(self, obj):
        request = self.context.get('request')
        reactions = []
        for reaction in obj.reactions.all():
            reactions.append(reverse(
                request=request,
                viewname='comment-reaction-detail',
                kwargs={'comment_pk' : obj.pk, 'pk' : reaction.pk}
            ))
        return reactions

    class Meta:
        model = Comment
        fields = ['url', 'body', 'post', 'author', 'creation_date', 'reactions']

class CommentReactionSerializer(serializers.HyperlinkedModelSerializer):

    url = serializers.SerializerMethodField()
    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True,
        lookup_field='username'
    )

    def get_url(self, obj):
        request = self.context['request']
        return reverse(
            viewname='comment-reaction-detail',
            request=request,
            kwargs={
                'comment_pk' : obj.comment.pk,
                'pk' : obj.pk,
            }
        )
    
    def validate(self, attrs):

        # Only validate on POST requests
        if self.instance is not None:
            return attrs

        request = self.context.get('request')
        comment_pk = self.context['view'].kwargs.get('pk')

        comment = get_object_or_404(Comment, pk=comment_pk)
        author = request.user #type: ignore 

        if CommentReaction.objects.filter(comment=comment, author=author).exists():
            raise serializers.ValidationError(
                "You have already reacted to this comment."
            )

        return attrs

    class Meta:
        model = CommentReaction
        fields = ['url', 'author', 'reaction_type', 'created_at', 'comment',]
        read_only_fields  = ['author', 'comment']