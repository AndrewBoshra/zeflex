from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns=[
    path('login', obtain_auth_token),
    path('register', views.register,name='register'),
    path('userdata', views.userdata,name='userdata'),
    path('movies',views.movies,name='movies'),
    path('random',views.randomlist,name='random'),
    path('movie',views.movie,name='movie'),
    path('reviews',views.reviews,name='reviews'),
    path('video',views.video,name='video'),
    path('genre',views.genre,name='genre'),
]