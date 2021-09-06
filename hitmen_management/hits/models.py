from django.contrib.auth.models import User
from django.db import models


class Hit(models.Model):
    workflow_values = [('assigned', 'Assigned'), ('failed', 'Failed'), ('completed', 'Completed')]

    hitman = models.OneToOneField(User, on_delete=models.RESTRICT)
    name = models.CharField('Name of the target', max_length=100)
    description = models.CharField('Brief', max_length=200)
    workflow = models.CharField('State Workflow', choices=workflow_values,
                                default='active', max_length=10)
    created_by = models.ForeignKey(User, related_name="hits_created", on_delete=models.CASCADE)
