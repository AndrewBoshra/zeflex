from movies.serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.core import paginator
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from rest_framework import status
from rest_framework.response import Response
from .models import * 




def get_movie(id): 
    try:
        return Movie.objects.get(pk=id)
    except:
        return None

def get_genre(id): 
    try:
        return Genre.objects.get(pk=id)
    except:
        return None

def get_video(id): 
    try:
        return Video.objects.get(pk=id)
    except:
        return None

def requiredParameters(*args):
    pars=' , '.join( [arg for arg in args])
    return Response({'error':f'parameters: [{pars}] are required'},status=400)
            
def movieNotFoundResponse(request):
    return Response({'error':'no movie with this id'},status=404)            


"""
    filter types:
        1- Genres (more than one value to display movies in any genre of them)
        2- Release year Just one value. limits the result only to released movies
        3- forKids. limits the result only to non adult movies
        3- query. Search query 
"""
def get_filtered_movies(filter_dict:dict):
    filters=[]
    if filter_dict.get('for_kids'):
        for_kids= int(filter_dict['for_kids'])
        if(for_kids==1):
            filters.append(Q(for_adult=False))
        
    if filter_dict.get('release_year'):
        year=int(filter_dict['release_year'])
        filters.append(Q(status='Released'))
        filters.append(Q(release_date__year=year))
    
    if filter_dict.get('genres'):
        genres=filter_dict['genres'].split(',')
        filters.append(Q(genres__name__in=genres))

    if filter_dict.get('q'):
        query=filter_dict['q']
        filters.append(Q(title__icontains=query) |Q(tagline__icontains=query)|Q(overview__icontains=query)  )
    
    movies=Movie.objects.filter(*filters).distinct().order_by('-release_date')
    print(*filters)
    return movies

def index(request:Request):
    pass

@api_view(['GET'])
def movies(request:Request):
    request_parameters=request.query_params 
    movies=get_filtered_movies(request_parameters)

    pageNum=request.query_params.get('page')
    pagina=paginator.Paginator(movies,20)
    page=pagina.get_page(pageNum)

    if request.query_params.get('details')=='1':
        serialized_data=MovieSerializer(page.object_list,many=True).data
    else:
        serialized_data=MovieSerializerCollapsed(page.object_list,many=True).data

    resp={
        'movies':serialized_data,
        'page':page.number,
        'pages_number':pagina.num_pages,
    }
    return Response(resp)
    
@api_view(['GET'])
def movie(request:Request):
    id=request.query_params['id']
    movie=get_movie(id)
    if movie is None:
        return movieNotFoundResponse(request)
    else:
        serialized_data=MovieSerializer(movie,many=False).data
        return Response(serialized_data)

@api_view(['GET','POST'])
def reviews(request:Request):
    if request.method=='GET':
        #get parameters 
        id=request.query_params.get('id')
        page=request.query_params.get('page')
    
        if not id :
            return requiredParameters('id')            
        
        movie=get_movie(id)
        if not movie :
            return movieNotFoundResponse(request)
        response={
            'reviews': ReviewSerializer(movie.reviews.all(),many=True).data,
        }
        if request.user.is_authenticated:
            if Review.objects.filter(reviewer=request.user,movie=movie).count()==0:
                response['can_review']=True
            else:
                response['can_review']=False
        return Response(response)

    elif request.method=='POST' and request.user.is_authenticated:
        
        reviewSerializer=ReviewSerializer(data=request.data)
        if not reviewSerializer.is_valid():
            return Response(reviewSerializer.errors)
            
        if Review.objects.filter(reviewer=request.user , movie=reviewSerializer.validated_data['movie']).count()>0:
            return Response({'error':'you can only review a movie once'},status=status.HTTP_400_BAD_REQUEST)

        reviewSerializer.validated_data['reviewer']=request.user
        reviewSerializer.save()
        return Response(reviewSerializer.data,status=status.HTTP_201_CREATED)


    return Response({'error':'please Log in '},status=status.HTTP_401_UNAUTHORIZED)




    

@api_view(['GET'])       
def genre(request:Request):
    if request.query_params.get('id'):
        id=request.query_params['id']
        genre=get_genre(id)
        if genre is None:
            return Response({'error':'not found'},status=404)
        else:
            return Response(GenreSerializer( genre,many=False).data)
    return Response(GenreSerializer( Genre.objects.all(),many=True).data)

@api_view(['GET'])
def video(request:Request):
    id=request.query_params['id']
    video=get_video(id)
    if video is None:
        return Response({'error':'not found'},status=404)
    else:
        return Response(VideoSerializer(video,many=False).data)

@api_view(['Post'])
def register(request:Request):
    serializer=UserRegisterationSerializer(data=request.data ,many=False)
    res={}
    if serializer.is_valid():
        newUser=serializer.save()
        token=Token.objects.create(user=newUser)
        res['response']='success'
        res['token']=token.key
        res['email']=newUser.email
        res['username']=newUser.username
        return Response(res)
    else:
        return Response(serializer.errors)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userdata(request):
    return Response(UserRegisterationSerializer(instance=request.user).data)

@api_view(['GET'])
def randomlist(request):
    number=request.query_params.get('number')
    try:
        number=int(number)
    except :
        number=20    
    return Response(MovieSerializerCollapsed(Movie.random_list(number),many=True).data)

