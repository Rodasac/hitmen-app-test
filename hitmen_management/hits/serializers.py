from django.contrib.auth.models import User
from rest_framework import serializers
from hits.models import Hit
from users.serializers import UserSerializer


class HitSerializer(serializers.HyperlinkedModelSerializer):
    hitman = UserSerializer()
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Hit
        fields = ['pk', 'url', 'hitman', 'created_by', 'workflow', 'name', 'description']

    def create(self, validated_data):
        request_user = self.context['request'].user
        hitman_to_add = validated_data.pop('hitman').pop('pk') if validated_data.get(
            'hitman') and validated_data.get('hitman').get('pk') else 0
        hitman_instance = User.objects.get(pk=hitman_to_add)

        hit = Hit.objects.create(
            name=validated_data['name'],
            description=validated_data['description'],
            workflow=validated_data['workflow'],
            hitman=hitman_instance,
            created_by=request_user
        )
        hit.save()

        return hit

    def update(self, instance, validated_data):
        state = validated_data.get('workflow')

        if state is not None and instance.workflow != 'assigned':
            raise serializers.ValidationError('State cannot change')
        for item in validated_data:
            if Hit._meta.get_field(item):
                setattr(instance, item, validated_data[item])
        instance.save()
        return instance
