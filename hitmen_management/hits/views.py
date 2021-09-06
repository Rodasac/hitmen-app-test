from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework import permissions
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from users.permissions import IsManagerOrBoss

from hits.models import Hit
from hits.serializers import HitSerializer


class HitViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Hit.objects.all()
    serializer_class = HitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsManagerOrBoss]
        return [permission() for permission in permission_classes]

    def list(self, request):
        user_id = request.user.pk

        if user_id == 1:
            queryset = Hit.objects.all()
            serialize = self.get_serializer(queryset, many=True)
            return Response(serialize.data)
        else:
            queryset = Hit.objects.filter(
                Q(created_by__exact=request.user) | Q(hitman__exact=request.user))
            serialize = self.get_serializer(queryset, many=True)
            return Response(serialize.data)

    def retrieve(self, request, pk=None):
        user_id = request.user.pk

        try:
            if user_id == 1:
                queryset = Hit.objects.get(pk=pk)
                serialize = self.get_serializer(queryset)
                return Response(serialize.data)
            else:
                queryset = Hit.objects.get(Q(pk=pk),
                                           Q(created_by__exact=request.user) | Q(
                    hitman__exact=request.user)
                )
                serialize = self.get_serializer(queryset)
                return Response(serialize.data)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
