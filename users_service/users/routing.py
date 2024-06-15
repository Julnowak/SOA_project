from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/user_socket/$", consumers.UsersConsumer.as_asgi()),
    re_path(r"ws/product_socket/$", consumers.ProductConsumer.as_asgi()),
]