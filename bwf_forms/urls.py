"""
URL configuration for bwf_forms project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.shortcuts import redirect
from django.urls import path, include
from django import urls
from .views import (
    HomeView,
    EditorView,
    FormView,
    FormHistoryView,
    FormsAPIViewset,
    FormVersionAPIViewset,
    get_form_structure_file,
)

# In your project's urls.py
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r"form", FormsAPIViewset)
router.register(r"form-version", FormVersionAPIViewset)


urlpatterns = [
    path("", lambda request: redirect("bwf_forms_home", permanent=True)),
    path("home/", HomeView.as_view(), name="bwf_forms_home"),
    path("form/<int:form_id>/", FormView.as_view(), name="form_info"),
    path('form/<int:form_id>/history/', FormHistoryView.as_view(), name='form_version_history'),
    path("editor/", EditorView.as_view(), name="form_editor"),
    path("editor/<int:form_id>/", EditorView.as_view(), name="form_editor_with_id"),
    path(
        "editor/<str:version_id>/",
        EditorView.as_view(),
        name="form_editor_with_version_id",
    ),
    path(
        'definition/<int:id>/<uuid:version_id>.json',
        get_form_structure_file,
        name="get_form_structure_file",
    ),
    path("api/", include(router.urls)),
]
