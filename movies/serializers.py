
from django.db.models.fields import CharField
from rest_framework import fields, serializers
from django.contrib.auth.models import User
from .models import * 

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Video
        fields=['link']

# class UserPartialSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=User
#         fields=['id','username']
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'
        depth=2

class UserRegisterationSerializer(serializers.ModelSerializer):
    email=serializers.EmailField()
    class Meta:
        model=User
        fields=['username','email','password']
        extra_kwargs={
            'password':{
                'write_only':True
            }
        }

    
    def save(self):
        user=User(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
        )
        password=self.validated_data['password']
        user.set_password(password)
        user.save()
        return user

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model=Genre
        fields='__all__'


class ReviewSerializer(serializers.ModelSerializer):
    reviewer=serializers.CharField(source='reviewer.username',required=False)
    avg_review=serializers.CharField(required=False)
    

    class Meta:
        model=Review
        fields='__all__'
        extra_kwargs={
            'comment':{
                'required':False
            }
        }
class MovieSerializer(serializers.ModelSerializer):
    videos=VideoSerializer(many=True)
    review=serializers.DictField(source='average_reviews')
    class Meta:
        model=Movie
        fields='__all__'
        depth=2

class MovieSerializerCollapsed(serializers.ModelSerializer):
    class Meta:
        model=Movie
        fields=['id','language','title','tagline','poster_path','genres','release_date']
        depth=2

