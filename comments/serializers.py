
from django.shortcuts import get_object_or_404
from rest_framework.reverse import reverse
from .models import Comment, CommentReaction, Post
from rest_framework import serializers

class CommentCreateSerializer(serializers.HyperlinkedModelSerializer):
    '''
    Used for create operations on comments
    '''

    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        lookup_field='slug',
        queryset=Post.objects.all()
    )

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        read_only=True,
    )

    def validate(self, attrs):
        parent_comment: Comment | None = attrs.get('parent')
        post: Post | None = attrs.get('post')
        if parent_comment and post and parent_comment.post != post:
            raise serializers.ValidationError(f"Comment parent's post must be the same as it's own post.")
        return super().validate(attrs)

    class Meta:
        model = Comment
        fields = ['url', 'id', 'body', 'post', 'parent', 'author', 'creation_datetime']

class CommentListSerializer(serializers.HyperlinkedModelSerializer):
    '''
    Used for list operations on comments
    '''
    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        lookup_field='slug',
        read_only=True
    )

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        read_only=True,
    )

    reactions_count = serializers.IntegerField(read_only=True)
    replies_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Comment
        fields = ['url', 'id', 'post', 'parent', 'author', 'creation_datetime', 'reactions_count', 'replies_count']

class CommentDetailSerializer(serializers.HyperlinkedModelSerializer):
    '''
    Used for retrieve/update/delete operations on comments
    '''

    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        lookup_field='slug',
        read_only=True
    )

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        read_only=True,
    )
    
    reactions_url = serializers.SerializerMethodField()
    def get_reactions_url(self, obj):
        request = self.context.get('request')
        return reverse(
            viewname='comment-reaction-list',
            request=request,
            kwargs={'pk' : obj.pk}
        )
    
    replies_url = serializers.SerializerMethodField()
    def get_replies_url(self, obj):
        request = self.context.get('request')
        return reverse('comment-list', query={'parent_comment_id' : obj.id}, request=request)

    class Meta:
        model = Comment
        fields = ['url', 'id', 'body', 'post', 'parent', 'author', 'creation_datetime', 'reactions_url', 'replies_url']
        read_only_fields = ['parent']

class CommentReactionSerializer(serializers.HyperlinkedModelSerializer):

    url = serializers.SerializerMethodField()
    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        lookup_field='username',
        read_only=True,
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
        '''
        This function exists so we can make sure users can only react to a comment once.
        '''

        # Only validate on POST requests
        if self.instance is not None:
            return attrs

        request = self.context.get('request')
        if request is None:
            raise serializers.ValidationError('request object is None')
        comment_pk = self.context['view'].kwargs.get('pk')
        comment = get_object_or_404(Comment, pk=comment_pk)
        author = request.user

        if CommentReaction.objects.filter(comment=comment, author=author).exists():
            raise serializers.ValidationError(
                "You have already reacted to this comment."
            )

        return attrs

    class Meta:
        model = CommentReaction
        fields = ['url', 'author', 'reaction_type', 'creation_datetime', 'comment']
        read_only_fields  = ['comment']