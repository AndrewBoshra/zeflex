from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields import IntegerField, TextField
from django.core.validators import MaxValueValidator,MinValueValidator
from random import randint
from django.db.models.aggregates import Count
from django.db.models.query import QuerySet
class Genre(models.Model):
    id=IntegerField(primary_key=True)
    name=TextField()
    
    def __str__(self) -> str:
        return self.name

class Movie(models.Model):
    STATUS=[
        ('Rumored','Rumored'),
        ('Planned','Planned'),
        ('In Production','In Production'),
        ('Post Production','Post Production'),
        ('Released','Released'),
        ('Canceled','Canceled'),
    ]
    id=models.IntegerField(primary_key=True)
    language=models.TextField()
    title=models.TextField()
    tagline=models.TextField()
    poster_path=models.TextField(blank=True,null=True)
    release_date=models.DateField()
    for_adult=models.BooleanField()
    imdb_id=models.TextField(null=True,blank=True)
    overview=models.TextField(null=True,blank=True)
    status=models.CharField(choices=STATUS,null=True,blank=True,max_length=20)
    genres=models.ManyToManyField(Genre,related_name='movies')
    
    def __str__(self) -> str:
        return self.title + ' : '+self.tagline 
    
    def average_reviews(self):
        reviews=self.reviews.all()
        reviews_count=reviews.count()
        if reviews_count==0:
            return{ 'avg_review':None,'reviewers_count':0}
        
        total_reviews=0
        for review in reviews:
            total_reviews +=review.avg_review()
        avg_review=float("{:.1f}".format(total_reviews/reviews_count))

        return{ 'avg_review':avg_review ,'reviewers_count':reviews_count}  
    @staticmethod
    def random_movie():
        count = Movie.objects.aggregate(count=Count('id'))['count'] 
        random_index = randint(0, count - 1)
        return Movie.objects.all()[random_index]
    @staticmethod
    def random_list(number):
        movielist=[]
        for _ in range(number):
            movielist.append(Movie.random_movie())
        return movielist
        
class Video(models.Model):
    TYPES=[
        ('Trailer','Trailer'),
        ('Teaser','Teaser'),
        ('Clip','Clip'),
        ('Featurette','Featurette'),
        ('Behind the Scenes','Behind the Scenes'),
        ('Bloopers','Bloopers'),]
    movie=models.ForeignKey(Movie,related_name='videos',on_delete=models.CASCADE)
    type=models.CharField(choices=TYPES,max_length=50)
    link=models.URLField()
    
    def __str__(self) -> str:
        return self.type +' for movie : '+self.movie.title
    


class Review(models.Model):
    reviewer=models.ForeignKey(User,related_name='reviews',on_delete=models.CASCADE)
    movie=models.ForeignKey(Movie,related_name='reviews',on_delete=models.CASCADE)
    comment=models.CharField(max_length=1024)
    directing=models.FloatField(validators=[MaxValueValidator(5),MinValueValidator(0)])
    writing=models.FloatField(validators=[MaxValueValidator(5),MinValueValidator(0)])
    cinematography=models.FloatField(validators=[MaxValueValidator(5),MinValueValidator(0)])
    editing=models.FloatField(validators=[MaxValueValidator(5),MinValueValidator(0)])
    acting=models.FloatField(validators=[MaxValueValidator(5),MinValueValidator(0)])
    sound=models.FloatField(validators=[MaxValueValidator(5),MinValueValidator(0)])

    def avg_review(self):
        return (self.directing+self.writing+self.cinematography+self.editing+self.acting+self.sound) /6
    def __str__(self) -> str:
        return self.reviewer.username+' Reviewed ' + self.movie.title + ' : ' + str(self.avg_review())+' Stars'
    
