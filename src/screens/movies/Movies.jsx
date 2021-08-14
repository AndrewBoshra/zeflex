import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/navbar/Navbar';
import './Movies.scss'
import { FilterList, CheckBoxOutlineBlankOutlined, CheckBoxOutlined } from '@material-ui/icons'
import { getGenres, getMovies } from '../../api_Interface/api_interface'
import MovieCard from '../../components/moviecard/MovieCard';
import Spinner from '../../components/spinner/Spinner';
const Movies = (props) => {

    //state 
    const [visibleDrawer, setVisibleDrawer] = useState(false);
    const [filterGenres, setFilterGenres] = useState([]);
    const [forKids, setForKids] = useState(false);
    const [movies, setMovies] = useState([])
    const [pagesCount, setPagesCount] = useState(1);
    const [page, setPage] = useState(1);
    const [isLoading, setisLoading] = useState(true)

    //api calls
    useEffect(async () => {
        const filters = {
            genres: props.genre ?? undefined,
            query: props.query ?? undefined
        };

        const data = await getMovies(filters, 1);
        setMovies(data.movies);
        setPage(1);
        setPagesCount(data.pages_number);
        setisLoading(false);

        const genres = await getGenres();
        genres.forEach((genre, index) => {
            genre.selected = genre.name === props.genre;
            genre.id = index;
        });
        setFilterGenres(genres);
    }, []);

    const loadMore = async () => {
        setisLoading(true);
        const data = await getMovies(getFilters(), page + 1);
        setPage(data.page);
        setMovies([...movies, ...data.movies]);
        setisLoading(false);

    }
    //filters
    const addGenre = (index) => {
        const genres = filterGenres.slice();
        genres[index].selected = !genres[index].selected;
        setFilterGenres(genres);
    };

    const getFilters = () => {
        const filters = {}

        filters.genres = filterGenres.filter(genre => genre.selected).reduce((prev, genre) => prev + genre.name + ',', '')
        filters.query = props.query ?? undefined;
        filters.forKids = forKids;
        if (releaseYearFilter.current.value !== '')
            filters.release_year = releaseYearFilter.current.value;
        return filters;
    }
    const filterResults = async () => {

        const filters = getFilters();
        setisLoading(true);
        const data = await getMovies(filters);
        setMovies(data.movies);
        setPagesCount(data.pages_number);
        setPage(1);
        setisLoading(false);
        setVisibleDrawer(false);
    }



    const releaseYearFilter = useRef('');
    const movieList = useRef('');

    return (
        <>
            <div className="backdrop-wrapper"></div>
            <Navbar />

            <div className="filter-icon" onClick={() => setVisibleDrawer(!visibleDrawer)}>
                <FilterList className="icon" />
            </div>

            <div className={visibleDrawer ? "drawer" : "drawer hidden"}>
                <div className="drawer-content">
                    <h3>Genres:</h3>
                    <div className="genre-container">
                        {
                            filterGenres.map(genre => <div key={genre.id} className={genre.selected === true ? "genre selected" : "genre"}
                                onClick={() => addGenre(genre.id)}>
                                {genre.name}
                            </div>)
                        }

                    </div>
                    <hr className="fullwidth" />

                    <div className="flex f-between fullwidth padding-v sm" onClick={() => setForKids(!forKids)}>
                        <h3>For Kids:</h3>
                        {forKids ? <CheckBoxOutlined /> : <CheckBoxOutlineBlankOutlined />}
                    </div>
                    <hr className="fullwidth" />
                    <div className="flex f-between fullwidth padding-v sm" >
                        <h3>Release year:</h3>
                        <input className="input-text" type="number" placeholder="2021" ref={releaseYearFilter} />
                    </div>
                    <hr className="fullwidth" />
                    <button type="button" onClick={filterResults} >Filter</button>
                </div>

            </div>
            {
                movies.length===0 ? <h1 className="notfound">Ooops we didn't find any Result</h1>:
                <div className="movie-cards-container" ref={movieList}>
                    {
                        movies.map(movie =>
                            <MovieCard movie={movie} />)
                    }
                </div>
            }
            {isLoading ? <Spinner /> :
                <>
                    {page < pagesCount &&
                        <div className="bottom">
                            <h3 onClick={loadMore}>Load more</h3>
                        </div>
                    }
                </>
            }
        </>

    );
}

export default Movies;
