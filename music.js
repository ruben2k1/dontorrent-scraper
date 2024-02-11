import puppeteer from 'puppeteer';
import {
    getTableInfoIn,
    getAnchorsIn,
    getTorrentRows,
    getTorrentInfo,
    getMovieAnchorsIn,
    getMovieTorrentInfo,
    getMusicTorrentInfo,
    checkIfMovieCard
} from './functions.js';
import { 
    insertFile,
    getLastIdFiles,
    insertEpisodes,
    insertMovies,
    insertEpisodesMovies,
    insertMusic,
    insertEpisodesMusic
} from './database.js';

(async () => {
    const totalPages = 1;

    const browser = await puppeteer.launch({
        headless: "new",
    });

    const page = await browser.newPage();

    await page.setViewport({width: 1920, height: 1080});

    const userAgents = [
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36', 
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41'
    ];

    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    await page.setUserAgent(randomUserAgent);
    
    let cookiesAccepted = false;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        await page.goto(`https://dontorrent.party/musica/page/${currentPage}`);

        console.log('CURRENT PAGE: ' + currentPage);

        if (!cookiesAccepted) {
            await page.click('#Close_fa');
            cookiesAccepted = true;
        }

        const anchorsIn = await getMovieAnchorsIn(page);

        for (const anchor of anchorsIn) {
            await page.goto(anchor);

            const movieCard = await checkIfMovieCard(page);

            if (movieCard.length < 1) {
                console.log('Vacío');
            }else{
                const torrentInfo = await getMusicTorrentInfo(page);

                await insertMusic(
                    torrentInfo[0].title,
                    'MUSICA',
                    torrentInfo[0].genero,
                    torrentInfo[0].imgSrc,
                    1
                );
                
                const last_id = await getLastIdFiles();
                
                console.log(torrentInfo[0].title)
                console.log(last_id);
    
                await insertEpisodesMusic(torrentInfo[0].aText, torrentInfo[0].releaseDate, last_id);
            }
        }
    }
})();