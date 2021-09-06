from rest_framework import permissions


class IsManagerOrBoss(permissions.BasePermission):
    """
    Custom permission to only allow managers and boss users.
    """

    def has_object_permission(self, request, view, obj):
        if (view.action == 'update' or view.action == 'partial_update') and (bool(
            request.user.hitmanprofile
        ) is False or request.user.hitmanprofile.manages.all().count() == 0):
            return False
        return request.user.pk == 1 or obj.hitman == request.user or obj.created_by == request.user

    def has_permission(self, request, view):
        if view.action == 'destroy':
            return True
        return request.user.hitmanprofile.manages.all().count() > 0


class UserViewIsManagerOrBoss(permissions.BasePermission):
    """
    Custom permission to only allow managers and boss users.
    """

    def has_object_permission(self, request, view, obj):
        if view.action == 'create':
            return False
        return bool(
            request.user.hitmanprofile and request.user.hitmanprofile.manages.all().count() > 0
        ) or obj.pk == request.user.pk

    def has_permission(self, request, view):
        if view.action == 'create':
            return False
        if view.action == 'retrieve':
            return True
        return bool(
            request.user.hitmanprofile and request.user.hitmanprofile.manages.all().count() > 0
        )


class IsBoss(permissions.BasePermission):
    """
    Custom permission to only allow boss user.
    """

    def has_object_permission(self, request, view, obj):
        return request.user.pk == 1

    def has_permission(self, request, view):
        return request.user.pk == 1
