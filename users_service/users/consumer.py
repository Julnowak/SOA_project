import json

import pika

from users.models import Product, UserProduct, AppUser

params = pika.URLParameters('amqps://dvfbayyt:4vQAgcKB7-YGNFq59JfPzJHyutX1RWgj@beaver.rmq.cloudamqp.com/dvfbayyt')
connection = pika.BlockingConnection(params)

channel = connection.channel()

channel.queue_declare(queue='products_service')


def callback(ch, method, properties, body):

    try:
        data = json.loads(str(body, 'utf-8'))
        print(data)
        if properties.content_type == 'product_created':
            product = Product(id=data['id'], name=data['name'], price=data['price'],
                              image=data['image'], is_bought=data['is_bought'],
                              likes=data['likes'])
            product.save()

            UserProduct.objects.create(user=AppUser.objects.get(username=data['username']), product=product)
            print('created')
        elif properties.content_type == 'product_updated':
            product = Product.objects.get(data['id'])
            product.name = data['name']
            product.save()
        elif properties.content_type == 'product_deleted':
            product = Product.objects.get(id=int(data))
            product.delete()
        elif properties.content_type == 'product_liked':
            user = AppUser.objects.get(username=data['username'])
            product = Product.objects.get(id=int(data['id']))

            if not UserProduct.objects.filter(user=user, product=product):
                new = UserProduct.objects.create(user=user, product=product)
                new.save()
            else:
                new = UserProduct.objects.get(user=user, product=product)
                new.delete()
            product.likes = UserProduct.objects.filter(product=product).count()
            product.save()
            print('liked')

    except:
        print('Something went wrong.')


channel.basic_consume(queue='products_service', on_message_callback=callback)

print('Started consuming')

channel.start_consuming()
