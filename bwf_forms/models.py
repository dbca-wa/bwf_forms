from django.db import models


# Create your models here.
class BwfForm(models.Model):
    form_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    active_version = models.ForeignKey('BwfFormVersion', related_name='active_forms', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class BwfFormVersion(models.Model):
    form = models.ForeignKey(BwfForm, related_name='versions', on_delete=models.CASCADE)
    version_number = models.IntegerField()

    definition = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('form', 'version_number')

    def __str__(self):
        return f"{self.form.name} - Version {self.version_number}"