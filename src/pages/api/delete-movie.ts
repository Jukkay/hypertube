import { NextApiRequest, NextApiResponse } from 'next';
import cron from 'node-cron';
import { prisma } from '../../server/db/client';
import fs from 'fs';

interface MovieData {
    id:	string
    imdb_code:	string
    movie_path:	string
    size:	number
    downloaded:	number
    date:	string
}

export const config = {
	api:{
		externalResolver: true,
	},
}

export default async function deleteFiles(
    req: NextApiRequest,
	res: NextApiResponse
){
     // '*/1 * * * * *' every second for testing
        console.log('cron is running in the background');
        let downloadedMovies: MovieData[] = [];
        let timestamp: number = Date.now();

        try {
            downloadedMovies = await prisma.movies.findMany();
        } catch (error) {
            console.error(error);
        }

        let moviesToDelete: MovieData[] = [];

        downloadedMovies?.filter((movie: MovieData) => {
            if(Date.parse(movie.date) < timestamp - 1) { // can use 1 instead of 2629800000 (1 month) to test. these are milliseconds
                moviesToDelete.push(movie);
            }
        })

        moviesToDelete.map(async (movie: MovieData) => {
            if (fs.existsSync(`./movies/${movie.imdb_code}`)) { // make sure this works properly
                fs.rmSync(`./movies/${movie.imdb_code}`, { recursive: true, force: true });
            }
            await prisma.movies.delete({
                where: {
                    imdb_code: movie.imdb_code
                }
            })
        })
    res.status(200);
};