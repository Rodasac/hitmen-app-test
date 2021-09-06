from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework import permissions
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from users.models import HitmanProfile
from users.permissions import IsBoss, UserViewIsManagerOrBoss
from users.serializers import (HitmanTokenObtainPairSerializer,
                               RegisterSerializer, UserSerializer, HitmanProfileSerializer)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, UserViewIsManagerOrBoss]

    def list(self, request):
        user_id = request.user.pk
        manages = request.user.hitmanprofile.manages.all().order_by('-date_joined')

        if user_id == 1:
            serialize = self.get_serializer(self.queryset, many=True)
            return Response(serialize.data)
        elif manages.count() > 0:
            serialize = self.get_serializer(manages, many=True)
            return Response(serialize.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, pk=None):
        user_id = request.user.pk
        manages = request.user.hitmanprofile.manages.all()

        try:
            if user_id == 1 or user_id == pk:
                queryset = User.objects.get(pk=pk)
                serialize = self.get_serializer(queryset)
                return Response(serialize.data)
            else:
                manage = manages.filter(pk=pk).get()
                serialize = self.get_serializer(manage)
                return Response(serialize.data)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], permission_classes=[IsBoss])
    def get_managed_users(self, request, pk=None):
        user = User.objects.get(pk=pk)
        manages = user.hitmanprofile.manages.all().order_by('-date_joined')
        serialize = self.get_serializer(manages, many=True)

        return Response(serialize.data)

    def destroy(self, request, pk=None):
        user = User.objects.get(id=pk)
        user.hitmanprofile.workflow = "inactive"
        user.hitmanprofile.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class HitmanProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users profile to be viewed or edited.
    """
    queryset = HitmanProfile.objects.all()
    serializer_class = HitmanProfileSerializer
    permission_classes = [permissions.IsAuthenticated, UserViewIsManagerOrBoss]

    def destroy(self, request, pk=None):
        HitmanProfile.objects.filter(id=pk).update(workflow="inactive")

        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(generics.CreateAPIView):
    """
    API endpoint that allows users to signup.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class HitmanTokenObtainPairView(TokenObtainPairView):
    serializer_class = HitmanTokenObtainPairSerializer
