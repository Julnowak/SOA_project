from asgiref.sync import sync_to_async
from django.http import JsonResponse
from django.shortcuts import render
from .serializers import MessageSerializer
from chat.models import Message


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

