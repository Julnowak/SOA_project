import json

import pika

params = pika.URLParameters('amqps://dvfbayyt:4vQAgcKB7-YGNFq59JfPzJHyutX1RWgj@beaver.rmq.cloudamqp.com/dvfbayyt')
connection = pika.BlockingConnection(params)

channel = connection.channel()


def publish(method, body):
    properties = pika.BasicProperties(method)
    channel.basic_publish(exchange='', routing_key='products_service', body=json.dumps(body), properties=properties)
