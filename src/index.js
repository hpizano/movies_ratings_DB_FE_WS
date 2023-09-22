import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const App = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async() => {
            const response = await axios.get('/api/movies');
            setMovies(response.data);
        }
        fetchMovies();
    }, []);

    const increaseRating = async(movie) => {
        const newRating = movie.stars + 1 ;
        const {data} = await axios.put(`/api/movies/${movie.id}`, {name: movie.name, stars: newRating}) ;
        const newMovies = movies.map((movieMap) => {
            if(movieMap.id === movie.id) {
                return data
            } else {
                return movieMap;
            };
        });
        setMovies(newMovies);
    };

    const decreaseRating = async (movie) => {
        const newRating = movie.stars - 1 ;
        const {data} = await axios.put(`/api/movies/${movie.id}`, {name: movie.name, stars: newRating});
        const newMovies = movies.map((movieMap) => {
            if(movieMap.id === movie.id) {
                return data
            } else {
                return movieMap;
            };
        });
        setMovies(newMovies);
    };

    return (
        <div>
          <h1> Rate the movie! ({movies.length})</h1>
          <div>
            <ul>
                {
                    movies.map((movie) => {
                        return(
                            <li key={movie.id}>                                
                                <h2>{movie.name}</h2>
                                <span>
                                <h3> Rating: {movie.stars} Stars </h3>
                                <button onClick= { () => {increaseRating(movie)}}> + </button>
                                <button onClick={() => {decreaseRating(movie)}}> - </button>
                                </span>
                                <div>
                                <button> Delete </button>
                                </div>
                            </li>
                        
                        )
                    })
                }
            </ul>
          </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);