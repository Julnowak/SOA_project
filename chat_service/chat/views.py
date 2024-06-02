from asgiref.sync import sync_to_async
from autobahn.wamp import serializer
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .producer import publish
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

        user = request.data['username']
        seller = request.data['seller']
        id = request.data['productId']
        product_price = request.data['productPrice']
        product_name = request.data['productName']

        print(Room.objects.filter(buyer=user, seller=seller, product=id).exists())
        if user != seller and Room.objects.filter(buyer=user, seller=seller, product=id).exists():
            chatroom = Room.objects.get(buyer=user, seller=seller, product=id)
            serializerRoom = RoomSerializer(chatroom)
            print('get')
        elif user != seller and not Room.objects.filter(buyer=user, seller=seller, product=id).exists():
            chatroom = Room.objects.create(buyer=user, seller=seller, product=id, new_offer_customer=float(product_price),
                                           new_offer_producent=float(product_price), product_name=product_name)

            serializerRoom = RoomSerializer(chatroom)
            publish('negotiation_created', serializerRoom)
            print('create')

        print(chatroom)

        return Response(serializerRoom.data, status=status.HTTP_200_OK)


class ChatRoomIdView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, room_id=None):
        chatroom = Room.objects.get(id=room_id)
        serializerRoom = RoomSerializer(chatroom)
        messages = Message.objects.filter(room=chatroom)
        serializerMessages = MessageSerializer(messages, many=True)

        return Response([serializerMessages.data, serializerRoom.data], status=status.HTTP_200_OK)


class EndNegotiation(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, room_id=None):
        chatroom = Room.objects.get(id=room_id)
        chatroom.status = "Zakończono"
        chatroom.save()
        serializerRoom = RoomSerializer(chatroom)
        return Response(serializerRoom.data, status=status.HTTP_200_OK)


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


