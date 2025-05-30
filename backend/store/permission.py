from rest_framework.permissions import BasePermission,IsAuthenticated
from rest_framework import permissions


class IsAdminAndReadOnly(BasePermission):

    def has_permission(self,request,view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
    
    
class IsAdminIsAuthenticatedAndReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        elif request.method=='POST':
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_staff)
        