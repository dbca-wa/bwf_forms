
from bwf_forms.models import (
    BwfForm,
    BwfFormVersion,
)
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer


class FormSerializer(ModelSerializer):
    class Meta:
        model = BwfForm
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class FormVersionSerializer(ModelSerializer):
    class Meta:
        model = BwfFormVersion
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class CreateFormSerializer(ModelSerializer):
    class Meta:
        model = BwfForm
        fields = ('form_id', 'name', 'description')
        read_only_fields = ('created_at', 'updated_at')


class CreateFormVersionSerializer(ModelSerializer):
    class Meta:
        model = BwfFormVersion
        fields = ('form', 'definition')
        read_only_fields = ('created_at', 'updated_at', 'version_number')