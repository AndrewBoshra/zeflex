const api = '/api/';
const token_key = 'access-token';

//get requests
const getMovie = async (id) => {
    return await fetch(api + 'movie?id=' + id).then(res => res.json());
}
const getRandomMovies=async (number)=>{
    const resp=await fetch(api+'random?number='+number)
    return await resp.json();
}
const getMovies = async (filters, page) => {
    var link = api + 'movies?';
    if (filters.genres !== undefined) {
        link += 'genres=' + filters.genres;
        link += '&';
    }
    if (filters.for_kids !== undefined && filters.for_kids === true) {
        link += 'for_kids=1';
        link += '&';
    }
    if (filters.release_year !== undefined && filters.release_year !== '') {
        link += 'release_year=' + filters.release_year;
        link += '&';
    }

    if (filters.query !== undefined) {
        link += 'q=' + filters.query;
        link += '&';
    }
    if (filters.details !== undefined && filters.details === true) {
        link += 'details=' + filters.details;
        link += '&';
    }

    if (page !== undefined)
        link += 'page=' + page;

    let data = await fetch(link).then(res => res.json());
    return data;
}

const getGenres = async () => {
    var link = api + 'genre';
    let data = await fetch(link).then(res => res.json());
    return data;
}
const getHeaders = () => isAuthenticated() ? {
    'Authorization': 'Token ' + localStorage.getItem(token_key)
    , 'Content-type': 'application/json'
} : undefined;

const getReviews = async (id) => {

    return await fetch(api + 'reviews?id=' + id, { headers: getHeaders() }).then(res => res.json());
}
//post requests
const postReview = async (review) => {
    const response = await fetch(api + 'reviews', {
        method: "POST",
        body: JSON.stringify(review),
        headers: getHeaders(),

    });
    if (response.status === 201)
        return await response.json() //added
    return null; //added

}
//Auth
const login = async (credentials) => {
    let data = await fetch(api + 'login',
        {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
    if (data.token !== undefined) {
        localStorage.setItem(token_key, data.token)
        return { success: true };
    }

    return data;
}

const register = async (credentials) => {
    let data = await fetch(api + 'register',
        {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
    if (data.token !== undefined) {
        localStorage.setItem(token_key, data.token)
        return { success: true };
    }
    return data;
}
const isAuthenticated = () => localStorage.getItem(token_key) !== null
const logout = () => localStorage.removeItem(token_key)

export { getReviews, getMovie, getMovies,getRandomMovies, getGenres, postReview, login, register, isAuthenticated, logout };