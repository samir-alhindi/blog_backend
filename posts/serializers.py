
from django.shortcuts import get_object_or_404
from rest_framework.reverse import reverse
from .models import Post, PostReaction
from rest_framework import serializers

class PostDetailSerializer(serializers.HyperlinkedModelSerializer):
    '''
    Used for retrieve/update/delete opperations on posts
    '''

    url = serializers.HyperlinkedIdentityField(
        view_name='post-detail',
        lookup_field='slug',
        read_only=True
    )

    reactions = serializers.SerializerMethodField()

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
                viewname='post-reaction-detail',
                kwargs={'slug' : obj.slug, 'pk' : reaction.pk}
            ))
        return reactions

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug', 'body', 'image', 'author', 'creation_datetime',
                  'last_edit_datetime', 'comments', 'reactions']
        read_only_fields = ['slug', 'comments', 'reactions']

class PostCreateSerializer(serializers.HyperlinkedModelSerializer):
    '''
    Used for create opperations on posts
    '''

    url = serializers.HyperlinkedIdentityField(
        view_name='post-detail',
        lookup_field='slug'
    )

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True,
        lookup_field='username'
    )

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug', 'body', 'image', 'author', 'creation_datetime']
        read_only_fields = ['slug']

class PostListSerializer(serializers.HyperlinkedModelSerializer):
    '''
    Used for list opperations on posts
    '''

    url = serializers.HyperlinkedIdentityField(
        view_name='post-detail',
        lookup_field='slug'
    )

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True,
        lookup_field='username'
    )

    reactions_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ['url', 'id', 'title', 'slug',  'image', 'author', 'creation_datetime', 'comments_count', 'reactions_count']
        read_only_fields = ['slug']

class PostReactionSerializers(serializers.HyperlinkedModelSerializer):

    url = serializers.SerializerMethodField()

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True,
        lookup_field='username'
    )
    
    post = serializers.HyperlinkedRelatedField(
        view_name='post-detail',
        read_only=True,
        lookup_field='slug'
    )

    def get_url(self, obj):
        request = self.context['request']
        return reverse(
            viewname='post-reaction-detail',
            request=request,
            kwargs={
                'slug' : obj.post.slug,
                'pk' : obj.pk,
            }
        )

    def validate(self, attrs):

        # Only validate on POST requests
        if self.instance is not None:
            return attrs

        request = self.context.get('request')
        slug = self.context['view'].kwargs.get('slug')

        post = get_object_or_404(Post, slug=slug)
        author = request.user #type: ignore 

        if PostReaction.objects.filter(post=post, author=author).exists():
            raise serializers.ValidationError(
                "You have already reacted to this post."
            )

        return attrs

    class Meta:
        model = PostReaction
        fields = ['url', 'author', 'reaction_type', 'post', 'created_at']