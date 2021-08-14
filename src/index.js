
import React from 'react';
import ReactDOM from 'react-dom';
import Register from './screens/register/Register';
import Home from './screens/home/Home';
import Movie from './screens/movie/Movie';
import './index.scss'
import Movies from './screens/movies/Movies';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  Redirect,
} from "react-router-dom";
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route  exact path="/auth">
          <Register />
        </Route>
        <Route exact path="/movies">
          <MoviesWrapper />
        </Route>
        <Route  exact path="/movie/:movieid" children={<Movie />}/>
        <Route  exact path="/discover">
          <Home/>
        </Route>
        <Route path="">
          <Redirect to="/movies"/>
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);


export default function MoviesWrapper() {
  const parameters= new URLSearchParams(useLocation().search);
  return <Movies query={parameters.get('q')} genre={parameters.get('genre')} />
}
