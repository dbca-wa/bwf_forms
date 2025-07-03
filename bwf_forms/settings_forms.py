from django.core.exceptions import ImproperlyConfigured
from django.contrib import messages
from django.conf import settings
from django.apps import apps

# from confy import env, database
import decouple
import os
from collections import OrderedDict
from django.conf import settings as django_settings

# Modify the settings to use templates from the bwf_forms app


django_settings.BWF_FORMS_USE_DEV = decouple.config('BWF_FORMS_USE_DEV', default=True, cast=bool)
django_settings.BWF_FORMS_DEV_URL = decouple.config('BWF_FORMS_DEV_URL', default='http://localhost:8075')




