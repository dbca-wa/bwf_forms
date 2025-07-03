
from django.db import transaction

from bwf_forms.models import BwfForm, BwfFormVersion

def set_form_active_version(version: BwfFormVersion):
    with transaction.atomic():
        version.set_as_active_version()
    return version