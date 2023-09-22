import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const App = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async() => {
            const response = await axios.get('/api/movies');
            setMovies(response.data);
        }
        fetchMovies();
    }, []);

    const increaseRating = async(movie) => {
        try {
            setError('');
            const newRating = movie.stars + 1 ;
            const response = await axios.put(`/api/movies/${movie.id}`, {name: movie.name, stars: newRating}) ;
            const newMovies = movies.map((movieMap) => {
                if(movieMap.id === movie.id) {
                    return response.data
                } else {
                    return movieMap;
                };
            });
            setMovies(newMovies);  
        } catch(error) {
            setError(error.response.data);
        }
    };

    const decreaseRating = async (movie) => {
        try{
            setError('');
            const newRating = movie.stars - 1 ;
            const response = await axios.put(`/api/movies/${movie.id}`, {name: movie.name, stars: newRating});
            const newMovies = movies.map((movieMap) => {
                if(movieMap.id === movie.id) {
                    return response.data
                } else {
                    return movieMap;
                };
            });
            setMovies(newMovies);
        } catch(error) {
            setError(error.response.data);
        }
    };

    return (
        <div>
          <h1 className='title'> Rate the movie! ({movies.length})</h1>
          <div>
            <ul>
                {
                    movies.map((movie) => {
                        return(
                            <li key={movie.id}>                                
                                <h2>{movie.name}</h2>
                                <span>
                                  <h3> Rating: {movie.stars} Stars </h3>
                                  <button onClick= {() => {increaseRating(movie)}}> + </button>
                                  <button onClick={() => {decreaseRating(movie)}}> - </button>
                                  <p>{error? error : " "}</p>
                                </span>
                                <div>
                                  <button onClick={() => {}}> Delete </button>
                                </div>
                                <hr/>
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