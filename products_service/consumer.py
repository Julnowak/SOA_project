import pika

params = pika.URLParameters('amqps://dvfbayyt:4vQAgcKB7-YGNFq59JfPzJHyutX1RWgj@beaver.rmq.cloudamqp.com/dvfbayyt')
connection = pika.BlockingConnection(params)

channel = connection.channel()

channel.queue_declare(queue='SR_app_project')

def callback(ch,method,props,body):
    print('Received in admin')
    print(body)

channel.basic_consume(queue='SR_app_project', on_message_callback=callback)
print('Started consuming')

channel.start_consuming()

channel.close()