import React, { useEffect, useState } from 'react'
import './ItemsWheel.scss'
import { ArrowBack, ArrowForward } from '@material-ui/icons'
import { getRandomMovies } from '../../api_Interface/api_interface';
import {
    Link,
} from "react-router-dom";
import Spinner from '../spinner/Spinner';

const getGenres = function (movie) {
    var genres = movie.genres.map(gen => gen.name);
    return genres.join(' , ');
}

export default function Itemswheel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [movies, setMovies] = useState([]);


    useEffect(async () => {
        let data = await getRandomMovies(20);
        setMovies(data);
    }, []);

    const next = () => {
        if (currentIndex < movies.length - 1)
            setCurrentIndex(currentIndex + 1)
    };
    const prev = () => {
        if (currentIndex > 0)
            setCurrentIndex(currentIndex - 1)
    };

    if (movies.length === 0)
        return <Spinner/>
        
    return <div className="center">
        <div className="itemswheel">
            <div className="backdrop">
                <img src={movies[currentIndex].poster_path} alt="" />
            </div>

            <div className="itemswheel-content">
                {movies.map((movie, index) => {
                    var classname = ""
                    if (index < currentIndex)
                        classname = "left"
                    else if (index > currentIndex)
                        classname = "right"
                    if (index > currentIndex + 1 || index < currentIndex - 1) {
                        classname += " hidden"
                    }

                    return <Link to={"movie/" + movie.id}><div key={index} className="card"
                        style={{
                            pointerEvents: index === currentIndex ? 'auto' : 'none'
                        }}>
                        <div className="card-content">
                            {index === currentIndex ?
                                <div className="card-data rounded">
                                    <h2> {movie.title}</h2>
                                    <span> {movie.tagline}</span>
                                    <table>
                                        <tr>
                                            <thead>Language:</thead>
                                            <td> {movie.language}</td>
                                        </tr>
                                        <tr>
                                            <thead>Genres:</thead>
                                            <td> {getGenres(movie)}</td>
                                        </tr>
                                    </table>
                                </div> : ''
                            }
                            <div className="image-wrapper">
                                <img className={classname + " rounded"} src={movie.poster_path} alt={movie.title} />
                            </div>
                        </div>
                    </div>
                    </Link>
                })}
            </div>

            <div className="controllers">
                <div className="icon" onClick={prev}>
                    <ArrowBack />
                </div>
                <div className="icon" onClick={next} >
                    <ArrowForward />
                </div>
            </div>
        </div>
    </div>
}
