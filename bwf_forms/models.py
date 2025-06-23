import json
import uuid

from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.utils.text import slugify


upload_storage = FileSystemStorage(location=settings.PRIVATE_MEDIA_ROOT)


def get_unique_form_version_id():
    return str(uuid.uuid4())


def upload_to_path(instance, filename):
    return f"bwf/forms/{instance.form.id}/{instance.version_id}/{filename}"


# Create your models here.
class BwfForm(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=500, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    active_version = models.ForeignKey(
        "BwfFormVersion",
        related_name="active_forms",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        if BwfForm.objects.filter(slug=self.slug).exclude(pk=self.id).exists():
            count = BwfForm.objects.filter(slug__startswith=self.slug).count()
            self.slug = f"{self.slug}-{count + 1}"
        super(BwfForm, self).save(*args, **kwargs)


class BwfFormVersion(models.Model):
    form = models.ForeignKey(BwfForm, related_name="versions", on_delete=models.CASCADE)
    version_id = models.CharField(
        max_length=60, default=get_unique_form_version_id, unique=True
    )

    definition = models.JSONField(blank=True, null=True)
    form_file = models.FileField(
        max_length=1000,
        upload_to=upload_to_path,
        null=True,
        blank=True,
        storage=upload_storage,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("form", "version_id")

    def __str__(self):
        return f"{self.form.name} - Version {self.version_id}"

    def get_json_form_structure(self):
        if self.form_file:
            with open(self.form_file.path, "r") as json_file:
                return json.load(json_file)
        return None

    def set_json_form_structure(self, definition):
        with open(self.form_file.path, "w") as json_file:
            json.dump(definition, json_file)
        self.save()
