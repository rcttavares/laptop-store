const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'UTF-8');
const laptopData = JSON.parse(json);

// Ler um arquivo (json)
// console.log(laptopData);

const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    // VISÃO GERAL DOS PRODUTOS
    if (pathname === '/products' || pathname === '/') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'UTF-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'UTF-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join(" ");
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                // console.log(cardsOutput);
                res.end(overviewOutput);
            });
        });
        // DETALHE DO COMPUTADOR
    } else if (pathname === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'UTF-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
        // IMAGENS
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathname)) {
        fs.readFile(`${__dirname}/data/img${pathname}`, (err, data) => {
            res.writeHead(200, {
                'Content-type': 'text/html'
            });

            res.end(data);
        });
        // URL NÃO ENCONTRADO
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });

        res.end("URL não foi encontrado no servidor.");
    }
});

server.listen(8080, () => {
    console.log("Servidor funcionou!");
});

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
};