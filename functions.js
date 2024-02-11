async function getTableInfoIn(page) {
    const infoTabla = await page.evaluate(() => {
        const td = document.querySelectorAll('.card-body .d-inline-block > table > tbody > tr > td').length;

        return td;
    })

    return infoTabla;
}

async function getAnchorsIn(page) {
    const getAnchorsIn = await page.evaluate(() => {
        const aIn = [...document.querySelectorAll('.p-0 > p > a')].map(a => {
            return a.href.trim();
        });

        return aIn;
    })

    return getAnchorsIn;
}

async function getTorrentRows(page) {
    const torrentRows = await page.evaluate(() => {
        const card = [...document.querySelectorAll('.card-body')];
        
        const data = card.flatMap(card => {
            const table = [...card.querySelectorAll('.d-inline-block > table > tbody > tr')];
            
            return table.map(tableData => {
                const tdText = [...tableData.querySelectorAll('td')].map((text) => {
                    return text.innerText.trim();
                });
                
                let tdTextClean = tdText.filter(item => {
                    return item !== 'Descargar';
                });
    
                tdTextClean = tdTextClean.slice(0, 2);
    
                const aText = tableData.querySelector('td > a').href.trim();
                
                return {
                    tdTextClean,
                    aText
                };
            });
        });
    
        return data;
    });

    return torrentRows;
}

async function getTorrentInfo(page) {
    const torrentInfo = await page.evaluate(() => {
        const card = [...document.querySelectorAll('.card-body')];
        
        const data = card.flatMap(card => {
            const title = card.querySelector('h2').innerText.trim();
            const description = card.querySelector('.d-inline-block > .text-justify > b.bold').nextSibling.textContent.trim();
            const imgSrc = card.querySelector('img').src.trim();
            const formato = card.querySelectorAll('p.m-1 b.bold')[0].nextSibling.textContent.trim();

            let episodiosElement = card.querySelectorAll('p.m-1')[1];

            let episodios = "NULL";

            if (episodiosElement) {
                const episodiosMatches = episodiosElement.textContent.trim().match(/\d+/);
                if (episodiosMatches) {
                    episodios = parseInt(episodiosMatches[0], 10);
                }
            }

            return {
                title,
                description,
                imgSrc,
                formato,
                episodios
            }
        });
    
        return data;
    });

    return torrentInfo;
}

async function getMovieAnchorsIn(page) {
    const getAnchorsIn = await page.evaluate(() => {
        const aIn = [...document.querySelectorAll('.card-body > .noticiasContent > .text-center > a')].map(a => {
            return a.href.trim();
        });

        return aIn;
    })

    return getAnchorsIn;
}

async function getMovieTorrentInfo(page) {
    const torrentInfo = await page.evaluate(() => {
        const card = [...document.querySelectorAll('.card-body')];
        
        const data = card.flatMap(card => {
            const rawTitle = card.querySelector('h1').innerText.trim();
            const title = rawTitle.replace(/Descargar | por Torrent/g, '');
            const description = card.querySelector('.text-justify > b.bold').nextSibling.textContent.trim();
            const imgSrc = card.querySelector('img').src.trim();
            const formato = card.querySelector('.text-center > .d-inline-block > p > b.bold').nextSibling.textContent.trim();
            
            const generoElemento = card.querySelectorAll('.d-inline-block > p:nth-child(2) > a');
            const generoSinConcatenar = [...generoElemento].map(genero => {
                return genero.innerText.trim();
            })
            let genero = generoSinConcatenar.join(", ");
            genero = genero.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

            const releaseDate = parseInt(card.querySelector('.d-inline-block > p:nth-child(1) > a').innerText.trim());
            const director = card.querySelector('.d-inline-block > p:nth-child(3) > a').innerText.trim();
            
            const repartoElemento = card.querySelectorAll('.mt-2 > a');
            const repartoSinConcatenar = [...repartoElemento].map(genero => {
                return genero.innerText.trim();
            })
            
            let repartoConcatenado = repartoSinConcatenar.join(", ");
            const reparto = repartoConcatenado.replace(/\.$/, '');
            const aText = card.querySelector('.text-center > p > a').href.trim();

            return {
                title,
                description,
                imgSrc,
                formato,
                genero,
                releaseDate,
                director,
                reparto,
                aText
            }
        });
    
        return data;
    });

    return torrentInfo;
}

async function checkIfMovieCard(page) {
    const element = await page.$$('.card-body > h2');

    return element;
}

async function getMusicTorrentInfo(page) {
    const torrentInfo = await page.evaluate(() => {
        const card = [...document.querySelectorAll('.card-body')];
        
        const data = card.flatMap(card => {
            const title = card.querySelector('h2').innerText.trim();
            const imgSrc = card.querySelector('img').src.trim();
            
            const genero = card.querySelector('.d-inline-block > p:nth-child(2) > b').nextSibling.textContent.trim();
            const releaseDate = parseInt(card.querySelector('.d-inline-block > p:nth-child(1) > b').nextSibling.textContent.trim());

            const aText = card.querySelector('.text-center > p > a').href.trim();

            return {
                title,
                imgSrc,
                genero,
                releaseDate,
                aText
            }
        });
    
        return data;
    });

    return torrentInfo;
}

async function getGameTorrentInfo(page) {
    const torrentInfo = await page.evaluate(() => {
        const card = [...document.querySelectorAll('.card-body')];
        
        const data = card.flatMap(card => {
            const rawTitle = card.querySelector('h2').innerText.trim();
            const title = rawTitle.replace(/Descargar | por Torrent/g, '');
            const imgSrc = card.querySelector('img').src.trim();
            const formato = card.querySelector('.d-inline-block > p > a').innerText.trim();
            const aText = card.querySelector('.text-center > p > a').href.trim();

            return {
                title,
                imgSrc,
                formato,
                aText
            }
        });
    
        return data;
    });

    return torrentInfo;
}

async function getDocumentaryTorrentInfo(page) {
    const torrentInfo = await page.evaluate(() => {
        const card = [...document.querySelectorAll('.card-body')];
        
        const data = card.flatMap(card => {
            const title = card.querySelector('h2').innerText.trim();
            const description = card.querySelector('.d-inline-block > .text-justify > b.bold').nextSibling.textContent.trim();
            const imgSrc = card.querySelector('img').src.trim();
            const formato = card.querySelectorAll('p.m-1 b.bold')[0].nextSibling.textContent.trim();

            let episodiosElement = card.querySelectorAll('p.m-1')[1];

            let episodios = "NULL";

            if (episodiosElement) {
                const episodiosMatches = episodiosElement.textContent.trim().match(/\d+/);
                if (episodiosMatches) {
                    episodios = parseInt(episodiosMatches[0], 10);
                }
            }

            return {
                title,
                description,
                imgSrc,
                formato,
                episodios
            }
        });
    
        return data;
    });

    return torrentInfo;
}

export {
    getTableInfoIn,
    getAnchorsIn,
    getTorrentRows,
    getTorrentInfo,
    getMovieAnchorsIn,
    getMovieTorrentInfo,
    checkIfMovieCard,
    getMusicTorrentInfo,
    getGameTorrentInfo,
    getDocumentaryTorrentInfo
};