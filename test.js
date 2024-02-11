import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    await page.setViewport({width: 1920, height: 1080});
    await page.goto('https://dontorrent.party/pelicula/22709/La-mujer-del-infierno');

    await page.waitForSelector('#Close_fa');
    await page.click('#Close_fa');
    
    async function checkIfMovieCard() {
        const element = await page.$$('.card-body > h1');

        return element;
    }

    const movieCard = await checkIfMovieCard();

    if (movieCard.length < 1) {
        console.log('Vacío');
    }else{
        async function getMovieTorrentInfo() {
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
    }





    




























    /*
    
    async function getMovieTorrentInfo() {
        const torrentInfo = await page.evaluate(() => {
            const card = [...document.querySelectorAll('.card-body')];
            
            const data = card.flatMap(card => {
                const title = card.querySelector('h1').innerText.trim();
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

    async function getTorrentInfo() {
        const torrentInfo = await page.evaluate(() => {
            const card = [...document.querySelectorAll('.card-body')];
            
            const data = card.flatMap(card => {
                const title = card.querySelector('h2').innerText.trim();
                const descripcion = card.querySelectorAll('.d-inline-block > .text-justify > b.bold')[0].nextSibling.textContent.trim();
                const imgSrc = card.querySelector('img').src.trim();
                const formato = card.querySelectorAll('p.m-1 b.bold')[0].nextSibling.textContent.trim();
                const episodios = parseInt(card.querySelectorAll('p.m-1 b.bold')[1].nextSibling.textContent.trim());
            
                return {
                    title,
                    descripcion,
                    imgSrc,
                    formato,
                    episodios
                }
            });
        
            return data;
        });
    
        return torrentInfo;
    }

    async function getTorrentRows() {
        const torrentInfo = await page.evaluate(() => {
            const card = [...document.querySelectorAll('.card-body')];
            
            const data = card.flatMap(card => {
                const table = [...card.querySelectorAll('.d-inline-block > table > tbody > tr')];
                
                return table.map(tableData => {
                    const tdText = [...tableData.querySelectorAll('td')].map((text) => {
                        return text.innerText;
                    });
                    
                    let tdTextClean = tdText.filter(item => {
                        return item !== 'Descargar';
                    });
        
                    tdTextClean = tdTextClean.slice(0, 2);
        
                    const aText = tableData.querySelector('td > a').href;
                    
                    return {tdTextClean, aText};
                });
            });
        
            return data;
        });

        return torrentInfo
    }

    async function getTableInfoIn() {
        const infoTabla = await page.evaluate(() => {
            const td = document.querySelectorAll('.card-body .d-inline-block > table > tbody > tr > td').length;
    
            return td;
        })

        return infoTabla;
    }

    async function getAnchorsIn() {
        const getAnchorsIn = await page.evaluate(() => {
            const aIn = [...document.querySelectorAll('.p-0 > p > a')].map(a => {
                return a.href;
            });
    
            return aIn;
        })

        return getAnchorsIn;
    }*/





    /*const result1 = await page.evaluate(() => {
        const quotes = document.querySelectorAll('.col-md-8 > h1 > a');

        const data = [...quotes].map(quote => {
            return quote.innerHTML;
        })

        return data;
    })

    const result2 = await page.evaluate(() => {
        const quotes = document.querySelectorAll('.quote');
        
        const data = [...quotes].map(quote => {
            const quoteText = quote.querySelector('.text').innerText;
            const author = quote.querySelector('.author').innerText;
            const tags = [...quote.querySelectorAll('.tag')].map(tag => tag.innerText);
            
            return {
                quoteText,
                author,
                tags
            }
        })

        return data;
    })

    const textoDelEnlace = await page.evaluate(() => {
        const enlace = document.querySelector('.col-md-8 > h1 > a');
        return enlace.innerHTML;
    });

    console.log(textoDelEnlace);
    console.log(result2);*/
})();