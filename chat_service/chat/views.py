from asgiref.sync import sync_to_async
from autobahn.wamp import serializer
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MessageSerializer, RoomSerializer
from chat.models import Message, Room


class AllRoomView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        username = request.data['username']
        user_type = request.data['user_type']

        if user_type == "producent":
            rooms = Room.objects.filter(seller=username)
        else:
            rooms = Room.objects.filter(buyer=username)
        serializerRoom = RoomSerializer(rooms, many=True)
        return Response(serializerRoom.data, status=status.HTTP_200_OK)


class RoomView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        print(request.data)
        buyer = request.data['username']
        seller = request.data['seller']
        user_type = request.data['user_type']
        id = request.data['room']

        print(id)

        try:
            chatroom = Room.objects.get(id = int(id))
            print('tried')
        except:
            product = request.data['product']
            if buyer != seller:
                chatroom = Room.objects.create(buyer=buyer, seller=seller, product=product)
            else:
                chatroom = Room.objects.get(id=int(id))
            print('Not ok')
        print(chatroom)
        serializerRoom = RoomSerializer(chatroom)
        return Response(serializerRoom.data, status=status.HTTP_200_OK)


class ChatRoomIdView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, room_id=None):
        chatroom = Room.objects.get(id=room_id)
        serializerRoom = RoomSerializer(chatroom)
        messages = Message.objects.filter(room=chatroom)
        serializerMessages = MessageSerializer(messages, many=True)

        return Response(serializerMessages.data, status=status.HTTP_200_OK)


def index(request):
    return render(request, "chat/index.html")


def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})


def get_messages(request):
    all_mess = Message.objects.all()
    print(all_mess)
    messages = MessageSerializer(all_mess, many=True)
    return JsonResponse(messages.data)


def send_message(request):
    print(request)
    print('AAAAAAAAA')
    content = request.body['content']
    message = Message.objects.create(content=content)
    return JsonResponse({'message': message})


