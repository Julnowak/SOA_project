import datetime
import json
import time

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from chat.models import Message, Room


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(self.room_name)
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        print(get_channel_layer())
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        print('disconnected')
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        message = None
        username = None
        room = None

        text_data_json = json.loads(text_data)
        print(text_data_json)
        try:
            message = text_data_json["message"]
            username = text_data_json["username"]
            room = text_data_json["room"]
        except:
            pass

        try:
            new = text_data_json["new"]
            print(new)
        except:
            pass

        if username and message and room:
            await self.save_message(username, message, room)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    async def save_message(self, username, content, room):
        # Save message to database
        # Your code to save message to database goes here
        await self.get_categories_value(username, content, room)

    @sync_to_async
    def get_categories_value(self, username, content, room):
        return Message.objects.create(username=username, message=content, timestamp=datetime.datetime.now(),
                                      room=Room.objects.get(id=int(room)))
