from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from users.models import HitmanProfile


class HitmanProfileAdmin(admin.StackedInline):
    model = HitmanProfile
    can_delete = False
    verbose_name_plural = 'hitmen_profiles'


class UserAdmin(BaseUserAdmin):
    inlines = (HitmanProfileAdmin,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
