from bwf_forms.models import (
    BwfForm,
    BwfFormVersion,
)
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer


class FormSerializer(ModelSerializer):
    class Meta:
        model = BwfForm
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")


class CreateFormSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=False, allow_blank=True)


class UpdateFormDefinitionSerializer(serializers.Serializer):
    definition = serializers.JSONField(required=True)


class FormBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = BwfForm
        fields = ["id", "name", "slug", "description", "created_at", "updated_at"]


class FormVersionSerializer(serializers.ModelSerializer):
    form = FormBasicSerializer()

    class Meta:
        model = BwfFormVersion
        fields = ["id", "version_id", "form", "created_at", "updated_at"]


class CreateFormVersionSerializer(ModelSerializer):
    class Meta:
        model = BwfFormVersion
        fields = ("form", "definition")
        read_only_fields = ("created_at", "updated_at", "version_number")
