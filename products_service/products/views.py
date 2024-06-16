import random

from django.shortcuts import render
from rest_framework import viewsets

from .models import Product, Transaction

from .serializers import ProductSerializer, TransactionSerializer
from rest_framework.response import Response
from rest_framework import status

# Create your views here.


class ProductViewSet(viewsets.ViewSet):

    def list(self, request):
        products = Product.objects.filter(is_bought=False)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def create(self, request):
        print(request.data)
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        newdict = {'username': request.data['username']}
        newdict.update(serializer.data)

        # publish('product_created', newdict)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self,request,pk=None):
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def update(self,request,pk=None):
        product = Product.objects.get(id=pk)
        if '/media/' in str(request.data['image']):
            pass
        else:
            product.image = str(request.data['image'])
        product.description = request.data['description']
        product.price = request.data['price']
        product.name = request.data['name']
        product.save()
        serializer = ProductSerializer(instance=product)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def destroy(self,request,pk=None):
        print(pk)
        print(request.data)
        product = Product.objects.get(id=pk)
        product.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def like(self, request, pk=None):
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(instance=product)
        d = serializer.data
        d['username'] = request.data['username']
        return Response(status=status.HTTP_200_OK)


class ProductUpdateLikes(viewsets.ViewSet):

    def post(self, request, pk=None):
        product = Product.objects.get(id=pk)
        print(request.data['likes_num'])
        product.likes = request.data['likes_num']
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TransactionViewSet(viewsets.ViewSet):

    def list(self, request):
        user_type = request.data['user_type']
        user_id = request.data['user_id']
        if user_type == "klient":
            transactions = Transaction.objects.filter(buyer=user_id)
        else:
            transactions = Transaction.objects.filter(seller=user_id)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)