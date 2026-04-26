from django.shortcuts import get_object_or_404
from rest_framework.reverse import reverse
from .models import Post, PostReaction
from rest_framework import serializers

class PostSerializer(serializers.HyperlinkedModelSerializer):

    url = serializers.HyperlinkedIdentityField(
        view_name='post-detail',
        lookup_field='slug'
    )

    author = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True,
        lookup_field='username'
    )

    comments_url = serializers.SerializerMethodField()
    reactions_url = serializers.SerializerMethodField()

    def get_comments_url(self, obj):
        request = self.context.get('request')
        return reverse(
            'post-comments-list',
            kwargs={'slug' : obj.slug},
            request=request
        )
    
    def get_reactions_url(self, obj):
        request = self.context.get('request')
        return reverse(
            'post-reactions-list',
            kwargs={'slug' : obj.slug},
            request=request
        )
    class Meta:
        model = Post
        fields = ['url', 'title', 'slug', 'body', 'image', 'creation_date', 'author', 'comments_url', 'reactions_url']
        read_only_fields = ['slug', 'author', ]
    
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
        request = self.context.get('request')
        return reverse(
            'post-reactions-detail',
            kwargs={'slug' : obj.post.slug, 'pk' : obj.pk},
            request=request
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
        fields = ['url', 'author', 'reaction_type', 'created_at', 'post']
        read_only_fields = ['post', 'author', 'comments_url', 'reactions_url']