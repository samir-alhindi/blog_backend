from rest_framework import serializers
from .models import Reaction

class ReactionSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Reaction
        fields = ['author', 'reaction_type', 'created_at']
        read_only_fields  = ['author']