import torrentStream from 'torrent-stream';
import { prisma } from '../../server/db/client';

export const downloadTorrent = async (magnetLink: string, imdbCode: string) => new Promise((resolve) => {
	
	let newMovie: {} | undefined;
	
	const torrentStreamOptions: {} = { // this will have to be specified later, testing purpose
		trackers: [
			'udp://open.demonii.com:1337/announce',
			'udp://tracker.openbittorrent.com:80',
			'udp://tracker.coppersurfer.tk:6969',
			'udp://glotorrents.pw:6969/announce',
			'udp://tracker.opentrackr.org:1337/announce',
			'udp://torrent.gresille.org:80/announce',
			'udp://p4p.arenabg.com:1337',
			'udp://tracker.leechers-paradise.org:6969',
		],
		path: `./movies/${imdbCode}`
	};

	const engine: TorrentStream.TorrentEngine = torrentStream(magnetLink, torrentStreamOptions);
	
	engine.on('ready', () => {
		console.log('Engine is ready! This is the url passed: ', magnetLink);
	})
	
	engine.on('torrent', () => {
		engine.files.forEach(async (file: TorrentStream.TorrentFile) => {
			if (file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.webm')) {
				file.select(); // !!!! UNCOMMENT TO DOWNLOAD THE MOVIE
				newMovie = await prisma.movies.create({
					data: {
						imdb_code: imdbCode,
						movie_path: file.path,
					},
				});
			  } else {
				file.deselect();
			}
		});
	});

	engine.on('download', () => {
		console.log('Piece downloaded!');
		resolve(newMovie); // maybe could resolve after a couple pieces not right away the first one
	});
	
	engine.on('idle', () => {
		// set the movie as downloaded into database or somewhere // have to add a new column as well to table
		engine.destroy(() => {
			console.log('All connections to peers destroyed.');
		})
	});
});

// The fs.existsSync() method is used to synchronously check if a file already exists in the given path or not
// It returns a boolean value which indicates the presence of a file.
// parameters : path: It holds the path of the file that has to be checked. It can be a String, Buffer or URL