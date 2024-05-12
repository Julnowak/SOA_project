import json

import pika

from products.models import Product, Negotiation, NegotiationProduct

params = pika.URLParameters('amqps://dvfbayyt:4vQAgcKB7-YGNFq59JfPzJHyutX1RWgj@beaver.rmq.cloudamqp.com/dvfbayyt')
connection = pika.BlockingConnection(params)

channel = connection.channel()

channel.queue_declare(queue='chat_service')


def callback(ch, method, properties, body):

    try:
        data = json.loads(str(body, 'utf-8'))
        print(data)
        if properties.content_type == 'negotiation_created':
            pass
            # negotiation = Negotiation(seller=data['seller'], buyer=data['buyer'], status=data['status'])
            # product.save()
            #
            # if not Negotiation.objects.filter(user=AppUser.objects.get(username=data['username']), product=product).exists():
            #      Negotiation.objects.create(seller=data['seller'], buyer=data['buyer'], status=data['status'])
            print('created')
        # elif properties.content_type == 'product_updated':
        #     product = Product.objects.get(data['id'])
        #     product.name = data['name']
        #     product.save()
        # elif properties.content_type == 'product_deleted':
        #     product = Product.objects.get(id=int(data))
        #     product.delete()
        # elif properties.content_type == 'product_liked':
        #     user = AppUser.objects.get(username=data['username'])
        #     product = Product.objects.get(id=int(data['id']))
        #
        #     if not UserProduct.objects.filter(user=user, product=product):
        #         new = UserProduct.objects.create(user=user, product=product)
        #         new.save()
        #     else:
        #         new = UserProduct.objects.get(user=user, product=product)
        #         new.delete()
        #     product.likes = UserProduct.objects.filter(product=product).count()
        #     product.save()
        #     print('liked')

    except KeyError:
        print('Something went wrong.')


channel.basic_consume(queue='chat_service', on_message_callback=callback)

print('Started consuming')

channel.start_consuming()
