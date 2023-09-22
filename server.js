const pg = require('pg');
const client = new pg.Client('postgres://localhost/movie_ratings_db');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json())

const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res) => res.sendFile(homePage));

const reactApp= path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res) => res.sendFile(reactApp));

const reactSourceMap= path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res) => res.sendFile(reactSourceMap));


const styleSheet= path.join(__dirname, 'style.css');
app.get('/style.css', (req, res) => res.sendFile(styleSheet));

//START OF EXPRESS ROUTES

//GET route /api/movies
app.get('/api/movies', async(req, res, next) => {
    try {
        const SQL =`
        SELECT * FROM movies
        ORDER by id
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch(error){
        next(error);
    };
});

//PUT /api/movies/:id
app.put('/api/movies/:id', async(req, res, next) => {
    try {
        const SQL =`
        UPDATE movies
        SET name = $1, stars = $2
        WHERE id = $3
        RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.stars, req.params.id]);
        res.send(response.rows[0]);
    } catch(error){
        next(error);
    };
});

const start = async() => {
    await client.connect();
    console.log('connected to database')
    const SQL = `
    DROP TABLE IF EXISTS movies;
    CREATE TABLE movies(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        stars INTEGER
    );
    INSERT INTO movies(name, stars) values('Episode IV: A New Hope', 2);
    INSERT INTO movies(name, stars) values('Episode V: The Empire Strikes Back', 3);
    INSERT INTO movies(name, stars) values('Episode VI: Return of the Jedi', 1);
    INSERT INTO movies(name, stars) values('Episode I: The Phantom Menace', 4);
    INSERT INTO movies(name, stars) values('Episode II: Attack of the Clones', 5);
    INSERT INTO movies(name, stars) values('Episode III: Revenge of the Sith', 5);

    `;
    await client.query(SQL);
    console.log('tables created');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=> console.log(`listening on port ${PORT}`));
    
}

start();