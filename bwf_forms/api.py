from django.shortcuts import render
from rest_framework import viewsets
from bwf_forms.models import (
    BwfForm,
    BwfFormVersion,
)
from bwf_forms.serializers import (
    FormSerializer,
    FormVersionSerializer,
)


class FormViewSet(viewsets.ModelViewSet):
    queryset = BwfForm.objects.all()
    serializer_class = FormSerializer


class FormVersionViewSet(viewsets.ModelViewSet):
    queryset = BwfFormVersion.objects.all()
    serializer_class = FormVersionSerializer
