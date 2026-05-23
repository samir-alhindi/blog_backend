
from django.shortcuts import get_object_or_404
from rest_framework.reverse import reverse
from .models import Post, PostReaction
from rest_framework import serializers

class PostSerializer(serializers.HyperlinkedModelSerializer):

    url = serializers.HyperlinkedIdentityField(
        view_name='post-detail',
        lookup_field='slug'
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
        fields = ['url', 'title', 'slug', 'body', 'image', 'creation_date', 'author', 'comments', 'reactions']
        read_only_fields = ['slug', 'comments', 'reactions']
    
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
        fields = ['url', 'author', 'reaction_type', 'created_at', 'post']