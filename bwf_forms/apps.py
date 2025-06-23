from django.apps import AppConfig


class FormBuilderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bwf_forms'
    alias = 'form_builder'
