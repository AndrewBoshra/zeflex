import React, { useState, useEffect} from 'react';
import './Movie.scss'
import Navbar from '../../components/navbar/Navbar';
import { StarsReview, StarsReviewInput } from '../../components/starsreview/StarsReview';
import Carousel from '../../components/carousel/Carousel';
import { getMovie, getReviews, postReview } from '../../api_Interface/api_interface';
import { ExpandMore, ExpandLess } from '@material-ui/icons/';
import {
    useParams, useHistory
} from "react-router-dom";
import Spinner from '../../components/spinner/Spinner';
const Movie = (props) => {
    const [movie, setMovie] = useState({});
    const [reviews, setReviews] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isReviews, setIsReviews] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [myReview, setMyReview] = useState({
        directing:0,
        writing:0,
        cinematography:0,
        editing:0,
        acting:0,
        sound:0,
        comment:'.'
    });
    const history = useHistory();
    const { movieid } = useParams();

    const redirectToGenre = (genreName) => history.push('/movies?genre=' + genreName);
    useEffect(async () => {
        const movie = await getMovie(movieid);
        setMovie(movie);
        setIsLoaded(true);
        const data = await getReviews(movieid);
        for (let review in reviews)
            review.isExpanded = false;
        setReviews(data.reviews);
        setCanReview(data.can_review);
    }, []);
    const expandCollapse = (index) => {
        const newReviews = reviews.slice();
        newReviews[index].isExpanded = !newReviews[index].isExpanded;
        setReviews(newReviews);
    }
    const submitReview = async (index) => {
        const review = {
            ...myReview,
            movie: movieid
        };
        const addedReview = await postReview(review);
        if (addedReview ) {
            setCanReview(false);
            setReviews([addedReview, ...reviews]);
        }
        
    }


    return ( 
        <div >
            <Navbar />
            {!isLoaded?<Spinner/>:<>
            <div className="backdrop-wrapper">
                <div className="backdrop-right">
                    <img src={movie.poster_path} alt="" />
                </div>
            </div>
            <div className="movie">
                <div className="movie-details">
                    <h1><span>{movie.title}</span> <span className="badge md sec">{movie.language}</span></h1>
                    <div className="review-imdb">
                        <div className="review" onClick={() => setIsReviews(!isReviews)}>
                            <StarsReview review={movie.review.avg_review} />
                            <p className="badge gold sm">{movie.review.avg_review ?? 0}</p>
                            <p className="review-count">
                                ({movie.review.reviewers_count})
                            </p>
                        </div>
                        <a href={"https://www.imdb.com/title/" + movie.imdb_id}> <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"  alt=""/></a>
                    </div>
                    <div className="genres">

                        {movie.genres.map(genre =>
                            <span key={genre.id} className="badge sm" onClick={() => redirectToGenre(genre.name)}> {genre.name}</span>
                        )}
                    </div>
                    <p className="tagline">{movie.tagline}</p>
                    <p>{movie.overview}</p>
                    {movie.videos.length > 0 && !isReviews &&
                        <Carousel className="videos" >
                            {
                                movie.videos.map((video =>
                                    <iframe key={video.id} width="300px" src={"https://www.youtube.com/embed/" + video.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;  gyroscope; picture-in-picture " ></iframe>
                                ))
                            }
                        </Carousel>
                    }
                </div>
                {isReviews &&
                    <div className="movie-reviews">
                        {canReview && <div className="movie-review-input"><table className="review-stars-table">

                            <tr>
                                <td>Directing</td>
                                <td><StarsReviewInput value={myReview.directing} callBack={(value) => { setMyReview({ ...myReview, directing: value }) }} /></td>

                            </tr>
                            <tr>
                                <td>Writing</td>
                                <td><StarsReviewInput value={myReview.writing} callBack={(value) => { setMyReview({ ...myReview, writing: value }) }} /></td>
                            </tr>
                            <tr>
                                <td>Cinematography</td>
                                <td><StarsReviewInput value={myReview.cinematography} callBack={(value) => { setMyReview({ ...myReview, cinematography: value }) }} /></td>
                            </tr>
                            <tr>
                                <td>Editing</td>
                                <td><StarsReviewInput value={myReview.editing} callBack={(value) => { setMyReview({ ...myReview, editing: value }) }} /></td>
                            </tr>
                            <tr>
                                <td>Acting</td>
                                <td><StarsReviewInput value={myReview.acting} callBack={(value) => { setMyReview({ ...myReview, acting: value }) }} /></td>
                            </tr>
                            <tr>
                                <td>Sound</td>
                                <td><StarsReviewInput value={myReview.sound} callBack={(value) => { setMyReview({ ...myReview, sound: value }) }} /></td>
                            </tr>
                        </table>
                            <div className="review-input">
                                <textarea  onChange={(e)=>setMyReview({...myReview,comment:e.target.value})} required placeholder={"Review " + movie.title} ></textarea>
                                <button  type="button" onClick={submitReview} >Review</button>
                            </div>
                        </div>
                        }
                        {reviews.map((review, index) => <>
                            <div key={review.id} className="movie-review">
                                <div className="review-comment">
                                    <h3>
                                        {review.reviewer}
                                    </h3>
                                    <p>
                                        {review.comment}
                                    </p>
                                </div>
                                <div className="right">
                                    {review.isExpanded ?
                                        <>
                                            <table className="review-stars-table">

                                                <tr>
                                                    <td>directing</td>
                                                    <td><StarsReview review={review.directing} /></td>
                                                    <td><ExpandLess className="icon" onClick={() => expandCollapse(index)} /></td>

                                                </tr>
                                                <tr>
                                                    <td>writing</td>
                                                    <td><StarsReview review={review.writing} /></td>
                                                </tr>
                                                <tr>
                                                    <td>cinematography</td>
                                                    <td><StarsReview review={review.cinematography} /></td>
                                                </tr>
                                                <tr>
                                                    <td>editing</td>
                                                    <td><StarsReview review={review.editing} /></td>
                                                </tr>
                                                <tr>
                                                    <td>acting</td>
                                                    <td><StarsReview review={review.acting} /></td>
                                                </tr>
                                                <tr>
                                                    <td>sound</td>
                                                    <td><StarsReview review={review.sound} /></td>
                                                </tr>
                                            </table>
                                        </> : <>
                                            <table className="review-stars-table">

                                                <tr>
                                                    <td>Review</td>
                                                    <td><StarsReview review={review.avg_review} /></td>
                                                    <td><ExpandMore className="icon" onClick={() => expandCollapse(index)} /></td>
                                                </tr>
                                            </table>
                                        </>}
                                </div>
                            </div>
                            <hr />
                        </>
                        )}
                    </div>
                }
            </div>
            </>
             }
        </div>
    );

}

export default Movie;
