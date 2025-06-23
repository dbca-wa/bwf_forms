from django.contrib import admin
from bwf_forms.models import (
    BwfForm,
    BwfFormVersion,
)
@admin.register(BwfForm)
class FormAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'description', 'created_at', 'updated_at')
    search_fields = ('slug', 'name')
    readonly_fields = ('created_at', 'updated_at')
    
    prepopulated_fields = {'slug': ('name', )}
    
@admin.register(BwfFormVersion)
class FormVersionAdmin(admin.ModelAdmin):
    list_display = ('form', 'version_id', 'created_at', 'updated_at')
    search_fields = ('form__name', 'version_id')
    readonly_fields = ('created_at', 'updated_at')
    list_filter = ('form',)
