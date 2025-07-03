import json
import mimetypes
import logging
from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, status
from rest_framework.response import Response

from django.core.paginator import Paginator
from django.core.files.base import ContentFile
from django.db import transaction
from django.db.models import Prefetch, Q, Max
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views import View
from django.conf import settings

from bwf_forms.models import BwfForm, BwfFormVersion
from bwf_forms import serializers
from bwf_forms.utils import set_form_active_version

logger = logging.getLogger(__name__)


class HomeView(View):
    template_name = "bwf_forms/main.html"

    def get(self, request, *args, **kwargs):

        context = {}

        return render(request, self.template_name, context=context)


class FormView(View):

    template_name = "bwf_forms/form_detail.html"
    def get(self, request, *args, **kwargs):
        form_id = kwargs.get("form_id")

        form = get_object_or_404(BwfForm, pk=form_id)
        versions = (
            form.versions.all()
            .only(
                "form_id",
                "version_number",
                "version_id",
                "created_at",
                "updated_at",
            )
            .order_by("is_active", "-updated_at")
        )
        active_version = versions.filter(is_active=True).first()
        versions = (
            versions.exclude(pk=active_version.pk) if active_version else versions
        )
        context = {
            "form": form,
            "active_version": active_version,
            "versions": versions,
            "BWF_FORMS_USE_DEV": settings.BWF_FORMS_USE_DEV,
            "BWF_FORMS_DEV_URL": settings.BWF_FORMS_DEV_URL,
        }

        return render(request, self.template_name, context=context)


class EditorView(View):
    template_name = "bwf_forms/form_edition.html"

    def get(self, request, *args, **kwargs):

        form_id = kwargs.get("form_id", None)
        version_id = kwargs.get("version_id", None)
        if version_id:
            # If version_id is provided, fetch the form using the version
            version = BwfFormVersion.objects.filter(version_id=version_id).first()
            if version:
                form = version.form
                form_id = form.id
            else:
                form = None
        else:
            # If form_id is provided, fetch the form directly
            form = BwfForm.objects.filter(pk=form_id).first()
            version = form.get_active_version() if form else None
            version_id = version.version_id if version else None

        context = {
            "form_id": form_id,
            "version_id": version_id,
            "version_object_id": version.id if version else None,
            "form": form,
            "version": version,
            "BWF_FORMS_USE_DEV": settings.BWF_FORMS_USE_DEV,
            "BWF_FORMS_DEV_URL": settings.BWF_FORMS_DEV_URL,
        }
        if form:
            context["form"] = serializers.FormSerializer(form).data

        return render(request, self.template_name, context=context)


class FormHistoryView(View):
    template_name = "bwf_forms/form_history.html"

    def get(self, request, *args, **kwargs):
        form_id = kwargs.get("form_id")

        form = get_object_or_404(BwfForm, pk=form_id)
        versions = (
            form.versions.exclude(is_disabled=True)
            .only(
                "form_id",
                "version_number",
                "version_id",
                "created_at",
                "updated_at",
            )
            .order_by("is_active", "-updated_at")
        )
        active_version = versions.filter(is_active=True).first()
        versions = (
            versions.exclude(pk=active_version.pk) if active_version else versions
        )
        context = {
            "form": form,
            "active_version": active_version,
            "versions": versions,
        }

        return render(request, self.template_name, context=context)


"""
------------------------------------------------------------------------------------------------------------
                                        Start: api
------------------------------------------------------------------------------------------------------------
"""


class FormsAPIViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows forms to be viewed or edited.
    """

    queryset = BwfForm.objects.all()
    serializer_class = serializers.FormSerializer

    def create(self, request, *args, **kwargs):
        serializer = serializers.CreateFormSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = serializer.validated_data.get("name")
        description = serializer.validated_data.get("description")

        # Create a new form instance
        instance = BwfForm.objects.create(
            name=name,
            description=description,
        )

        version = BwfFormVersion.objects.create(form=instance)
        json_data = json.dumps("", indent=4)

        file_name = f"form_{version.version_id}.json"
        version.form_file.save(file_name, ContentFile(json_data))

        return Response(
            serializers.FormVersionSerializer(version).data,
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):

        page_param = request.GET.get("page", "1")
        page_size_param = request.GET.get("page_size", "10")

        search = request.GET.get("search", "")
        form_versions_queryset = (
            BwfFormVersion.objects.filter(is_disabled=False)
            .filter(Q(is_edition=True) | Q(is_active=True))
            .only(
                "form_id",
                "version_id",
                "created_at",
                "updated_at",
            )
            .order_by("is_active", "-updated_at")
        )
        bwf_forms = BwfForm.objects.all().prefetch_related(
            Prefetch("versions", queryset=form_versions_queryset)
        )

        if search != "":
            bwf_forms = bwf_forms.filter(name__icontains=search)
        paginator = Paginator(bwf_forms, page_size_param)
        page = paginator.page(page_param)
        return JsonResponse(
            {
                "count": paginator.count,
                "hasPrevious": page.has_previous(),
                "hasNext": page.has_next(),
                "results": self.get_serializer(page.object_list, many=True).data,
            }
        )


class FormVersionAPIViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows form versions to be viewed or edited.
    """

    queryset = BwfFormVersion.objects.all()
    serializer_class = serializers.FormVersionSerializer

    def create(self, request, *args, **kwargs):
        serializer = serializers.CreateFormVersionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        form_id = serializer.validated_data.get("form_id")
        version_id = serializer.validated_data.get("version_id", None)
        json_form = json.dumps("")
        if version_id:
            parent_version = get_object_or_404(
                BwfFormVersion, version_id=version_id, form__id=form_id
            )
            instance = parent_version.form
            json_form = json.dumps(parent_version.get_json_form_structure(), indent=4)
        else:
            instance = get_object_or_404(BwfForm, id=form_id)

        version_number = instance.versions.aggregate(
            version_number=Max("version_number")
        ).get("version_number", 0)
        version_number = version_number + 1 if version_number else 1
        try:
            with transaction.atomic():
                version = BwfFormVersion.objects.create(
                    form=instance,
                    version_number=version_number,
                )
                file_name = f"form_{version.version_id}.json"
                version.form_file.save(file_name, ContentFile(json_form))
            return Response(
                serializers.FormVersionSerializer(version).data,
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return JsonResponse(
                {"error": "Failed to create form version", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(BwfFormVersion, pk=kwargs.get("pk"))
        serializer = serializers.UpdateFormDefinitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        form_structure = serializer.validated_data.get("form_structure")

        # Update the form version's definition
        instance.set_json_form_structure(form_structure)

        return JsonResponse(
            {
                "message": "Form version definition updated successfully",
                "version_id": instance.version_id,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"])
    def get_json_form(self, request, pk=None):
        """
        Retrieve the JSON structure of a form version.
        """
        version_id = request.query_params.get("version_id", None)
        version = BwfFormVersion.objects.filter(
            version_id=version_id, form__id=pk
        ).first()

        json_structure = version.get_json_form_structure()

        if json_structure is None:
            return JsonResponse(
                {"error": "No JSON structure found for this version"}, status=404
            )

        return JsonResponse(json_structure, safe=False)

    @action(detail=True, methods=["POST"])
    def mark_form_active_version(self, request, *args, **kwargs):
        version_id = request.query_params.get("version_id", None)
        version = get_object_or_404(
            BwfFormVersion, pk=kwargs.get("pk"), version_id=version_id
        )
        try:
            # TODO: Validate form
            set_form_active_version(version)
        except Exception as e:
            logger.error(f"Error setting active version: {str(e)}")
            return JsonResponse(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return JsonResponse({"success": True, "message": "Active version changed"})

    @action(detail=True, methods=["POST"])
    def deactivate_form_version(self, request, *args, **kwargs):
        version_id = request.query_params.get("version_id", None)
        version = get_object_or_404(
            BwfFormVersion, pk=kwargs.get("pk"), version_id=version_id
        )
        if version.is_active:
            return JsonResponse(
                {"success": False, "message": "Cannot deactivate the active version"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        version.is_disabled = True
        version.disabled_at = datetime.now().astimezone()
        version.save()
        return JsonResponse(
            {"success": True, "message": "Version deactivated successfully"}
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_form_structure_file(request, id, version_id):
    file = None

    version = get_object_or_404(BwfFormVersion, id=id, version_id=version_id)
    file = version.form_file

    if file is None:
        return Response("File doesn't exist", status=status.HTTP_404_NOT_FOUND)

    file_data = version.get_json_form_structure()
    return Response(file_data, content_type=mimetypes.types_map[".json"])
