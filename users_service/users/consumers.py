import datetime
import json
import time

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .models import UserLike


class UsersConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        self.user_socket = "user_socket"

        # Join room group
        await self.channel_layer.group_add(self.user_socket, self.channel_name)

        print(get_channel_layer())
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        print('disconnected')
        await self.channel_layer.group_discard(self.user_socket, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        productId = text_data_json['productId']
        userId = text_data_json['userId']

        likes = await self.set_like(productId, userId)

        await self.channel_layer.group_send(
            self.user_socket, {'type': 'users.message', "likes": likes}
        )

    # Receive message from room group
    async def users_message(self, event):
        print(event)
        likes = event["likes"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"likes": likes}))

    @sync_to_async
    def set_like(self, productId, userId):
        if UserLike.objects.filter(user_id=int(userId), product_id=productId).exists():
            UserLike.objects.get(user_id=int(userId), product_id=productId).delete()

        else:
            UserLike.objects.create(user_id=int(userId), product_id=productId)
        likes = UserLike.objects.filter(product_id=productId).count()
        return likes
