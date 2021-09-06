from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.models import HitmanProfile


class HitmanProfileSerializer(serializers.HyperlinkedModelSerializer):
    manages = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    workflow = serializers.ReadOnlyField()

    class Meta:
        model = HitmanProfile
        fields = ['pk', 'url', 'manages', 'workflow']

    def update(self, instance, validated_data):
        request_user = self.context['request'].user.pk
        manages = validated_data.pop('manages') if validated_data.get('manages') else []

        if len(manages) > 0 and request_user != 1:
            raise serializers.ValidationError('Only the boss can update manages attribute', 403)
        for item in validated_data:
            if HitmanProfile._meta.get_field(item):
                setattr(instance, item, validated_data[item])
        if len(manages) > 0:
            instance.manages.clear()
            for manage in manages:
                instance.manages.add(manage)
        instance.save()
        return instance


class UserSerializer(serializers.HyperlinkedModelSerializer):
    pk = serializers.IntegerField()
    hitmanprofile = HitmanProfileSerializer()

    class Meta:
        model = User
        fields = ['pk', 'url', 'username', 'email', 'first_name', 'last_name', 'hitmanprofile']
        read_only_fields = ('username',)

    def update(self, instance, validated_data):
        request_user = self.context['request'].user.pk
        manages = validated_data.pop('hitmanprofile').pop('manages') if validated_data.get(
            'hitmanprofile') and validated_data.get('hitmanprofile').get('manages') else []

        if len(manages) > 0 and request_user != 1:
            raise serializers.ValidationError('Only the boss can update manages attribute', 403)
        for item in validated_data:
            if User._meta.get_field(item):
                setattr(instance, item, validated_data[item])
        if len(manages) > 0:
            instance.hitmanprofile.manages.clear()
            for manage in manages:
                instance.hitmanprofile.manages.add(manage)
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        # Creates hitman profile
        profile = HitmanProfile.objects.create(
            user=user,
        )
        profile.save()

        # Add hitman to boss
        boss = User.objects.get(pk=1)
        boss.hitmanprofile.manages.add(profile)
        boss.save()

        return user


class HitmanTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        is_manager = bool(
            user.hitmanprofile and user.hitmanprofile.manages.all().count() > 0
        )

        # Add custom claims
        token['email'] = user.email
        token['firstName'] = user.first_name
        token['lastName'] = user.last_name
        token['isManager'] = is_manager

        return token
