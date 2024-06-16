import datetime
import json
import time

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

from products.models import Product, Transaction


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        self.product = self.scope["url_route"]["kwargs"]["product"]
        print(self.product)
        self.product_sales = f"sales_{self.product}"

        # Join room group
        await self.channel_layer.group_add(self.product_sales, self.channel_name)

        print(get_channel_layer())
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        print('disconnected')
        await self.channel_layer.group_discard(self.product_sales, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        print(text_data_json)

        product = text_data_json['product']
        seller = text_data_json['seller']
        buyer = text_data_json['buyer']
        price = text_data_json['price']
        chat = text_data_json['chat']
        finalPrice = text_data_json['finalPrice']

        await self.change_isbought(product, seller, buyer, chat, price, finalPrice)

        await self.channel_layer.group_send(
            self.product_sales, {'type': 'sales.message', "product": product}
        )

        await self.channel_layer.group_send(
            "sales", {'type': 'sales.update', 'product': product}
        )

    # Receive message from room group
    async def sales_message(self, event):
        print(event)
        product = event["product"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"product": product}))

    @sync_to_async
    def change_isbought(self, product_id, seller, buyer, chat, price, finalPrice):
        p = Product.objects.get(id=product_id)
        p.is_bought = True
        p.save()

        if int(chat) == 0:
            new_chat = None
        else:
            new_chat = chat

        if new_chat is not None:
            Transaction.objects.create(product=int(product_id), seller=seller, buyer=buyer, chat=new_chat,
                                       price=float(p.price),
                                       name=p.name, likes=p.likes, finalPrice=float(finalPrice))
        elif new_chat is None:
            Transaction.objects.create(product=int(product_id), seller=seller, buyer=buyer, chat=new_chat,
                                   price=float(p.price),
                                   name=p.name, likes=p.likes, finalPrice=float(p.price))
        return p.is_bought


class SalesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        self.sales = "sales"

        # Join room group
        await self.channel_layer.group_add(self.sales, self.channel_name)

        print(get_channel_layer())
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        print('disconnected')
        await self.channel_layer.group_discard(self.sales, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        products = text_data_json['products']

        await self.channel_layer.group_send(
            self.sales, {'type': 'sales.message', "products": products}
        )

    # Receive message from room group
    async def sales_message(self, event):
        print(event)
        products = event["products"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"products": products}))

    async def sales_update(self, event):
        product = event["product"]
        await self.send(text_data=json.dumps({"product": product}))

