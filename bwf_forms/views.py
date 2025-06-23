import json
import uuid

from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response

from django.core.files.base import ContentFile
from django.db.models import Prefetch, Q
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from bwf_forms.models import BwfForm, BwfFormVersion
from bwf_forms import serializers



class HomeView(View):
    template_name = "bwf_forms/main.html"

    def get(self, request, *args, **kwargs):

        context = {}

        return render(request, self.template_name, context=context)


class EditorView(View):
    template_name = "bwf_forms/editor.html"

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
            form  = BwfForm.objects.filter(pk=form_id).first()
            version = form.active_version if form else None
            version_id = version.version_id if version else None
        
        context = {
            "form_id": form_id,
            "version_id": version_id,
            "is_new": form_id is None,
            "USE_DEV": True,
            "DEV_URL": "http://localhost:8000",

        }
        if form:
            context["form"] = serializers.FormSerializer(form).data

        return render(request, self.template_name, context=context)


class FormVisualizerView(View):
    template_name = "bwf_forms/visualizer.html"

    def get(self, request, *args, **kwargs):

        context = {}

        return render(request, self.template_name, context=context)


class FormsAPIViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows forms to be viewed or edited.
    """

    queryset = BwfForm.objects.all().prefetch_related(
        Prefetch(
            "versions", queryset=BwfFormVersion.objects.all().order_by("-created_at")
        )
    )
    serializer_class = serializers.FormBasicSerializer

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
        

        # Create a new form version with the provided definition
        version  = BwfFormVersion.objects.create(
            form=instance,
            definition=serializer.validated_data.get("definition"),
        )
        # save definition as json
        json_data = json.dumps("[]", indent=4)
        temp_name = str(uuid.uuid4())
        file_name = f"form_{temp_name}.json"
        version.form_file.save(file_name, ContentFile(json_data))

        instance.active_version = version
        instance.save()

        return Response(serializers.FormVersionSerializer(version).data, status=201)

    def update(self, request, *args, **kwargs):

        instance = self.get_object()
        serializer = serializers.UpdateFormDefinitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        definition = serializer.validated_data.get("definition")
        # Update the form's definition

        return JsonResponse(
            {
                "message": "Form definition updated successfully",
                "form_id": instance.form_id,
                "definition": definition,
            },
            status=200,
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

        form = serializer.validated_data.get("form")
        definition = serializer.validated_data.get("definition")

        # Create a new form version
        version = BwfFormVersion.objects.create(
            form=form,
            definition=definition,
        )

        return Response(serializers.FormVersionSerializer(version).data, status=201)
    
    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(BwfFormVersion, version_id=kwargs.get("pk"))
        serializer = serializers.UpdateFormDefinitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        definition = serializer.validated_data.get("definition")
        
        # Update the form version's definition
        instance.set_json_form_definition(definition)
        instance.save()

        return JsonResponse(
            {
                "message": "Form version definition updated successfully",
                "version_id": instance.version_id,
                "definition": definition,
            },
            status=200,
        )

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        version_id = request.query_params.get("version_id", None)

        version = BwfFormVersion.objects.filter(version_id=version_id, form__id = pk).first()
        if not version:
            return JsonResponse(
                {"error": "Form version not found"}, status=404
            )
        
        return super().retrieve(request, *args, **kwargs)
    
    @action(detail=True, methods=["get"])
    def get_json_form(self, request, pk=None):
        """
        Retrieve the JSON structure of a form version.
        """
        version_id = request.query_params.get("version_id", None)
        version = BwfFormVersion.objects.filter(version_id=version_id, form__id = pk).first()

        json_structure = version.get_json_form_structure()
        
        if json_structure is None:
            return JsonResponse({"error": "No JSON structure found for this version"}, status=404)

        return JsonResponse(json_structure, safe=False)