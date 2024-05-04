import json

import pika
from django.contrib.auth.models import User

params = pika.URLParameters('amqps://dvfbayyt:4vQAgcKB7-YGNFq59JfPzJHyutX1RWgj@beaver.rmq.cloudamqp.com/dvfbayyt')
connection = pika.BlockingConnection(params)

channel = connection.channel()

channel.queue_declare(queue='users_service')


def callback(ch,method,properties,body):
    print('Received in admin')
    data = json.loads(body)
    print(data)

    if properties.content_type == 'user_logged_in':
        print('aaaaa')
        print(User.objects.all())
        user = User.objects.get(email=data['email'])


channel.basic_consume(queue='users_service', on_message_callback=callback)
print('Started consuming')

channel.start_consuming()

channel.close()