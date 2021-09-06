from django.contrib import admin

from hits.models import Hit


class HitAdmin(admin.ModelAdmin):
    model = Hit
    verbose_name_plural = 'hits'


admin.site.register(Hit, HitAdmin)
