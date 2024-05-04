import json

import pika

from users.models import Product

params = pika.URLParameters('amqps://dvfbayyt:4vQAgcKB7-YGNFq59JfPzJHyutX1RWgj@beaver.rmq.cloudamqp.com/dvfbayyt')
connection = pika.BlockingConnection(params)

channel = connection.channel()

channel.queue_declare(queue='products_service')


def callback(ch,method,properties,body):
    data = json.loads(body)
    print(data)

    if properties.content_type == 'product_created':
        product = Product(id=data['id'], name=data['name'])
        product.save()
    elif properties.content_type == 'product_updated':
        product = Product.objects.get(data['id'])
        product.name = data['name']
        product.save()
    elif properties.content_type == 'product_deleted':
        product = Product.objects.get(data['id'])
        product.delete()


channel.basic_consume(queue='products_service', on_message_callback=callback)
print('Started consuming')

channel.start_consuming()

channel.close()