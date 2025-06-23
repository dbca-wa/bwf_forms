from django.shortcuts import render
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch, Q
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View



class HomeView(View):
    template_name = "form_builder/main.html"

    def get(self, request, *args, **kwargs):
        
        context = {
            
        }

        return render(request, self.template_name, context=context)
    
class EditorView(View):
    template_name = "form_builder/editor.html"

    def get(self, request, *args, **kwargs):
        
        context = {
            
        }

        return render(request, self.template_name, context=context)
    


class FormVisualizerView(View):
    template_name = "form_builder/visualizer.html"

    def get(self, request, *args, **kwargs):
        
        context = {
            
        }

        return render(request, self.template_name, context=context)