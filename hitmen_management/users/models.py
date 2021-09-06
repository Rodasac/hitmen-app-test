from django.contrib.auth.models import User
from django.db import models


class HitmanProfile(models.Model):
    workflow_values = [('active', 'Active'), ('inactive', 'Inactive')]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    manages = models.ManyToManyField(User, related_name="hitman_manager", blank=True)
    workflow = models.CharField('State Workflow', choices=workflow_values,
                                default='active', max_length=10)
