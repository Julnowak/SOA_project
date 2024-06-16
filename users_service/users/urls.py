from . import views
from django.urls import path

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('productuser/<int:pk>', views.UserProductSite.as_view(), name='user_product'),
    path('productuser/', views.UserAllProductSite.as_view(), name='user_products_all'),
    path('likes/', views.LikeView.as_view(), name='like_view'),
    path('all_likes/', views.AllLikesView.as_view(), name='all_like_view'),
    path('unlike/<int:pk>', views.UnlikeView.as_view(), name='unlike_view'),
    path('get_likes/<int:pk>', views.UnlikeView.as_view(), name='get_likes_view'),
    path('remove_product_likes/<int:pk>', views.RemoveProductLikes.as_view(), name='remove_product_likes'),
]
