import './MovieCard.scss'

import React from 'react'
import {
    NavLink,
} from "react-router-dom";

export default function MovieCard(props) {
    return (
        <NavLink to={"/movie/"+props.movie.id}>
            <div className="movie-card" >
                <div className="movie-poster">
                    <img src={props.movie.poster_path} alt={props.movie.title+" poster"} />
                </div>
                <div className="movie-title">
                    <div className="movie-name">
                        {props.movie.title}
                    </div>
                    <div className="movie-year">
                        ({props.movie.release_date.split('-')[0]})
                    </div>
                </div>
            </div>
        </NavLink>
    )
}
