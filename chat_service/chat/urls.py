"""
URL configuration for chat_service project.

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

from django.urls import path
from . import views


urlpatterns = [
    path("messages/", views.get_messages, name="messages"),
    path("chatroom/", views.RoomView.as_view(), name="roomView"),
    path("allroom/", views.AllRoomView.as_view(), name="allRoomView"),
    path("chatroom/<int:room_id>/", views.ChatRoomIdView.as_view(), name="chatroomView"),
    path("chatroom/<int:room_id>/end", views.EndNegotiation.as_view(), name="endNegotiation"),
    path("chatroom/end/<int:pk>", views.EndAllNegotiations.as_view(), name="endAllNegotiations"),
    path("chatroom/<int:room_id>/renew", views.RenewNegotiation.as_view(), name="renewNegotiation"),
]