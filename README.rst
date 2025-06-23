============
bwf_forms
============

bwf_forms is a Django app to build flexible, reusable workflows from a highlevel,
that can be integrated with any other Django App.

Quick start
-----------

1. Add "bwf_forms" to your INSTALLED_APPS setting like this::

    INSTALLED_APPS = [
        ...,
        "bwf_forms",
    ]

2. Include the polls URLconf in your project urls.py like this::

    path("bwf_forms/", include("bwf_forms.urls")),

3. Run ``python manage.py migrate`` to create the models.

4. Start the development server and visit the admin to create a workflow.
