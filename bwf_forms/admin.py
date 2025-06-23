from django.contrib import admin
from bwf_forms.models import (
    BwfForm,
    BwfFormVersion,
)
@admin.register(BwfForm)
class FormAdmin(admin.ModelAdmin):
    list_display = ('form_id', 'name', 'description', 'created_at', 'updated_at')
    search_fields = ('form_id', 'name')
    readonly_fields = ('created_at', 'updated_at')
    
@admin.register(BwfFormVersion)
class FormVersionAdmin(admin.ModelAdmin):
    list_display = ('form', 'version_number', 'created_at', 'updated_at')
    search_fields = ('form__form_id', 'version_number')
    readonly_fields = ('created_at', 'updated_at')
    list_filter = ('form',)
