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
    
    version_id = models.CharField(max_length=60, null=True, blank=True)

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

    def get_json_form_structure(self):
        form_json = {}
        active_version = self.get_active_version()
        if active_version and active_version.form_file:
            with open(active_version.form_file.path) as json_file:
                form_json = json.load(json_file)
        return form_json
    
    def get_active_version(self):
        return self.versions.filter(is_active=True).first()


class BwfFormVersion(models.Model):
    form = models.ForeignKey(BwfForm, related_name="versions", on_delete=models.CASCADE)
    version_id = models.CharField(
        max_length=60, default=get_unique_form_version_id, unique=True
    )
    version_number = models.IntegerField(default=1)

    definition = models.JSONField(blank=True, null=True)
    form_file = models.FileField(
        max_length=1000,
        upload_to=upload_to_path,
        null=True,
        blank=True,
        storage=upload_storage,
    )
    is_edition = models.BooleanField(default=True)
    is_active = models.BooleanField(default=False)
    activated_on = models.DateTimeField(blank=True, null=True)

    is_disabled = models.BooleanField(default=False)
    disabled_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("form", "version_id")

    @property
    def is_editable(self):
        return self.is_edition and not self.is_active and not self.is_disabled

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

    def set_as_active_version(self):
        self.form.versions.filter(is_active=True).update(is_active=False)
        self.is_active = True
        self.is_edition = False
        self.activated_on = self.updated_at
        self.save()
        self.form.version_id = self.version_id
        self.form.save()