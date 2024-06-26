"""
URL configuration for SR_app_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.contrib import admin
from django.urls import path, include
from .views import ProductViewSet, TransactionViewSet, ProductUpdateLikes

urlpatterns = [
    path('products/', ProductViewSet.as_view(
        {
            'get': 'list',
            'post': 'create'
        }
    )),

    path('products/<str:pk>', ProductViewSet.as_view(
        {
            'get': 'retrieve',
            'put': 'update',
            'delete': 'destroy'
        }
    )),
    path('products/<str:pk>/like',ProductViewSet.as_view(
        {
            'post': 'like',
        }
    )),

    path('transactions/', TransactionViewSet.as_view(
        {'post': 'list'}
    )),
    path('update_likes/<int:pk>', ProductUpdateLikes.as_view(
        {'post': 'post'}
    )),

]