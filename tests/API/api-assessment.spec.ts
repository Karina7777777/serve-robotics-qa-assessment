import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = 'https://api.themoviedb.org/3';
const token = process.env.TMDB_TOKEN;

// Helper function to make authenticated GET requests
async function getWithAuth(request: any, endpoint: string) {
    return await request.get(`${baseUrl}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
        },
    });
}


test('Get popular movies returns 200 and results', async ({ request }) => {
    const response = await getWithAuth(request, '/movie/popular'); // I'm using the helper function to make an authenticated GET request to the /movie/popular endpoint
    expect(response.status()).toBe(200); // I'm asserting that the response status code is 200, which means the request was successful and the endpoint is working as expected

    const body = await response.json();

    expect(body).toHaveProperty('results');
    expect(body.results.length).toBeGreaterThan(0); // I'm asserting that the response body has a 'results' property and that it contains at least one movie, which indicates that the endpoint is returning data as expected
    expect(body.results[0]).toHaveProperty('title'); // [0] first movie in the results list
    expect(body.results[0]).toHaveProperty('id'); // [0] verifying the first movie has an id
    //console.log('Popular movies:', body.results);
});



test('Search movie by title returns matching results', async ({ request }) => {
    const movieName = 'Batman'; //we need this line, because for the search endpoint "Batman", I need a query parameter.
    const response = await getWithAuth(request, `/search/movie?query=${movieName}}`);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('results'); // checking if the response contains search results
    expect(body.results.length).toBeGreaterThan(0); // results list is not empty
    expect(body.results[0]).toHaveProperty('title');

    const movieTitles = body.results.map((movie: any) => movie.title); // Extracting the movie titles from the search results into a separate array for easier verification
    expect(movieTitles).toContain('Batman Begins'); // Verifies that particularly "Batman Begins" exists in the returned movie titles.
});


test('Invalid endpoint returns 404', async ({ request }) => {
    const response = await getWithAuth(request, '/invalid endpoint'); // Verifying that the API correctly returns a 404 Not Found status code for endpoints that do not exist

    expect(response.status()).toBe(404);
    console.log(response.statusText());

});

test('Invalid Movie ID', async ({ request }) => {

    const invalidMovieId = '000000000'; // using obviously invalid movie ID, to get 404 response
    const response = await getWithAuth(request, `/movie/${invalidMovieId}`);
    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body).toHaveProperty('status_code');
    expect(body).toHaveProperty('status_message');
    expect(body.status_message).toContain('Invalid');
    console.log(body.status_message);
});


test('Request without authorization token returns unauthorized error', async ({ request }) => {
    const response = await request.get(`${baseUrl}/movie/popular`, {
        headers: {
            accept: 'application/json', // purposely not using function getWithAuth, because it contains token
        },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('status_code');
    expect(body).toHaveProperty('status_message');
    expect(body.status_message).toContain('Invalid');
});


test('Movie details by ID', async ({ request }) => {
    const movieId = 550 // Fight Club
    const response = await getWithAuth(request, `/movie/${movieId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();

    // console.log(body);

    expect(body).toHaveProperty('id', movieId);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('release_date');
    expect(body).toHaveProperty('runtime');
    expect(body.title).toBe('Fight Club');

});


test('Search non existing movie', async ({ request }) => {
    const movieName = 'aksdjh7654jhsjkal'; // random movie name that doesn't exist
    const response = await getWithAuth(request, `/search/movie?query=${movieName}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('results');
    expect(body.results.length).toBe(0); // no results should be returned for a non-existing movie, so the results array should be empty
});


test('Get movie genres list returns valid genres', async ({ request }) => {
    const response = await getWithAuth(request, '/genre/movie/list');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('genres');
    expect(body.genres.length).toBeGreaterThan(0);
    const genreNames = body.genres.map((genre: any) => genre.name);
    expect(genreNames).toContain('Action');
    expect(genreNames).toContain('Comedy');
    expect(genreNames).toContain('Drama');
});


test('Verify adult flag exist in movie details', async ({ request }) => {
    const movieId = 550; // Fight Club
    const response = await getWithAuth(request, `/movie/${movieId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('adult');
    expect(typeof body.adult).toBe('boolean');

});


test('Verify response time is under 3 seconds', async ({ request }) => {
    const startTime = Date.now();  //record start time 
    const response = await getWithAuth(request, '/movie/popular');
    const endTime = Date.now(); //record end time after receiving the response
    const responseTime = endTime - startTime;
    /** To measure how long the request took, capture the start time before sending it and the end time after the response returns. 
     * Subtracting the start time from the end time gives a positive duration, which is the actual response time.
     */
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(3000);
    console.log(`Response time: ${responseTime} ms`);

});

