import puppeteer from 'puppeteer';
import { getTableInfoIn, getAnchorsIn, getTorrentRows, getTorrentInfo } from './functions.js';
import { insertFile, getLastIdFiles, insertEpisodes } from './database.js';

(async () => {
    const totalPages = 104;

    const browser = await puppeteer.launch({
        headless: "new",
    });

    const page = await browser.newPage();

    await page.setViewport({width: 1920, height: 1080});

    let cookiesAccepted = false;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        await page.goto(`https://dontorrent.party/documentales/letra-./page/${currentPage}`);

        console.log(currentPage);

        if (!cookiesAccepted) {
            await page.click('#Close_fa');
            cookiesAccepted = true;
        }

        const anchorsIn = await getAnchorsIn(page);

        for (const anchor of anchorsIn) {
            await page.goto(anchor);

            const tableInfoIn = await getTableInfoIn(page);
            
            if (tableInfoIn!==0) {
                const torrentInfo = await getTorrentInfo(page);
                const torrentRows = await getTorrentRows(page);

                console.log(torrentInfo[0]);
                console.log(torrentRows[0]);

                await insertFile(
                    torrentInfo[0].title,
                    torrentInfo[0].description,
                    'DOCUMENTARY',
                    torrentInfo[0].formato,
                    torrentInfo[0].imgSrc,
                    1
                );
                
                const file_id = await getLastIdFiles();

                for (let i = 0; i < torrentRows.length; i++) {
                    const episode = torrentRows[i].tdTextClean[0];
                    const date = torrentRows[i].tdTextClean[1];
                    const ext_file_route = torrentRows[i].aText;
                    
                    await insertEpisodes(episode, ext_file_route, date, file_id);
                }
            }
        }
    }
})();