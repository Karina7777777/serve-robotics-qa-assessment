import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = 'https://api.themoviedb.org/3';
const token = process.env.TMDB_TOKEN;

async function getWithAuth(request: any, endpoint: string) {
    return await request.get(`${baseUrl}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
        },
    });
}


test('Get popular movies returns 200 and results', async ({ request }) => {
    const response = await getWithAuth(request, '/movie/popular');
    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('results');
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0]).toHaveProperty('title');
    expect(body.results[0]).toHaveProperty('id');
    //console.log('Popular movies:', body.results);
});



test('Search movie by title returns matching results', async ({ request }) => {
    const movieName = 'Batman'; //we need this line, because for the search endpoint "Batman", I need a query parameter.

    const response = await getWithAuth(request, `/search/movie?query=${movieName}}`);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('results');
    expect(body.results.length).toBeGreaterThan(0);

    expect(body.results[0]).toHaveProperty('title');

    const movieTitles = body.results.map((movie: any) => movie.title);

    expect(movieTitles).toContain('Batman Begins');

});


test('Invalid endpoint returns 404', async ({ request }) => {
    const response = await getWithAuth(request, '/invalid endpoint');

    expect(response.status()).toBe(404);
    console.log(response.statusText());

});

test('Invalid Movie ID', async ({ request }) => {
    const invalidMovieId = '000000000';

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
            accept: 'application/json',
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
    //console.log(body);

    expect(body).toHaveProperty('id', movieId);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('release_date');
    expect(body).toHaveProperty('runtime');
    expect(body.title).toBe('Fight Club');

});


test('Search non existing movie', async ({ request }) => {
    const movieName = 'aksdjh7654jhsjkal';
    const response = await getWithAuth(request, `/search/movie?query=${movieName}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('results');
    expect(body.results.length).toBe(0);
})


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
    const startTime = Date.now();
    const response = await getWithAuth(request, '/movie/popular');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(3000);
    console.log(`Response time: ${responseTime} ms`);

});

