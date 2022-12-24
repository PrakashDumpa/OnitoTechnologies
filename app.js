const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const path = require("path");
const dbpath = path.join(__dirname, "internshala.db");
let db = null;

const initializeServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3004, () => {
      console.log("Server at port 3004 has started running...");
    });
  } catch (e) {
    console.log(`DB error raised ${e.message}`);
    process.exit(1);
  }
};
initializeServer();

//Longest Duration of 10 movies

app.get("/api/v1/longest-duration-movies", async (request, response) => {
  const getLongestDurationOfMoviesQuery = `
      SELECT
      tconst,primaryTitle,runtimeMinutes,genres
      FROM
        movies
      ORDER BY cast(runtimeMinutes AS INTEGER) DESC
      LIMIT 10
      OFFSET 0;`;

  const dbResponse = await db.all(getLongestDurationOfMoviesQuery);
  response.send(dbResponse);
});

//Add New Movies

app.post("/api/v1/new-movie", async (request, response) => {
  const { tconst, titleType, runtimeMinutes, genres, primaryTitle } =
    request.body;
  const addQuery = `
    INSERT INTO
    movies (tconst,titleType,primaryTitle,runtimeMinutes,genres)
    VALUES(
        '${tconst}','${titleType}','${primaryTitle}','${runtimeMinutes}','${genres}'
    );`;
  const dbResponse = await db.run(addQuery);
  response.send("success");
});

//Average rating

app.get("/api/v1/top-rated-movies", async (request, response) => {
  const getRatingQuery = `
      SELECT
      movies.tconst AS tconst, movies.primaryTitle AS primaryTitle, movies.genres AS genres,ratings.averageRating AS averageRating
      FROM
        movies INNER JOIN ratings ON movies.tconst = ratings.tconst
      WHERE averageRating > "6.0"
      ORDER BY averageRating DESC;`;

  const dbResponse = await db.all(getRatingQuery);
  response.send(dbResponse);
});
