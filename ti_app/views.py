from django.shortcuts import render
from django.views.generic.base import ContextMixin, View

from rest_framework_tracking.models import APIRequestLog
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework_tracking.mixins import LoggingMixin
from .serializer import UserSerializer, GroupSerializer


# app view class
class AppView(ContextMixin, View):
    def get(self, request):
        context = self.get_context_data()
        users = User.objects.all()[:10]
        logs = APIRequestLog.objects.all().exclude(view_method='list')

        context['logs'] = logs
        context['users'] = users
        return render(request, 'index.html', context)


# class for loading logs with ajax
class LogsAjax(ContextMixin, View):
    def get(self, request):
        context = self.get_context_data()
        logs = APIRequestLog.objects.all().exclude(view_method='list')

        context['logs'] = logs
        return render(request, 'logs.html', context)


# user view set
class UserViewSet(LoggingMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


# group view set
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer