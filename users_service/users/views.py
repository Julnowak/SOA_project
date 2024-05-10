import json

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from users.serializers import UserSerializer, UserRegisterSerializer, UserLoginSerializer, ProductSerializer
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import login, logout
from .producer import publish
from .models import UserProduct, AppUser, Product
from .vaildations import validate_email, validate_password, custom_validation


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        validated_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=validated_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(validated_data)
            user.user_type = validated_data['user_type']
            user.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)

            user_data = {
                'id': user.user_id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
            }

            # publish('user_logged_in', d)
            return Response(user_data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)

        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class UserProductSite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, pk=None):
        relation = UserProduct.objects.get(product_id=pk)

        user = AppUser.objects.get(username=relation.user)
        product = Product.objects.get(id=relation.product.id)
        serializer = ProductSerializer(product)
        d = serializer.data
        d['username'] = user.username
        return Response(d, status=status.HTTP_200_OK)


class UserAllProductSite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):

        prods = Product.objects.filter(userproduct__user__username=request.data['username'])
        serializer = ProductSerializer(prods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)