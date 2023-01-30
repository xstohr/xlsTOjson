const xlsx = require('xlsx');
var fs = require('fs');

const process = require('process');

var argv = process.argv;

const inputFile = argv[2];
let outputFile = '';

//ochrana kdyz uzivatel nezada nazev vychoziho souboru
if (argv[3] == null || undefined) {
    outputFile = 'output.json'
} else {
    outputFile = argv[3];
}

convertFile();

function convertFile() {
    const file = xlsx.readFile(inputFile);
    const sheetName = file.SheetNames;
    const totalSheets = sheetName.length;
    
    for (let i = 0; i < totalSheets; i++) {
        const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetName[i]]);
        reshapeData(tempData);
    }
}

//uprava dat do spravne struktury
function reshapeData(data) {
    let PB = {};
    let tempData = [];
    let pudniBloky = [];
    for (let i = 0; i < data.length; i++) {
        if ( typeof data[i]['č.vz.'] == 'number') {
            tempData.push(data[i]);
        } else if ( typeof data[i]['č.vz.'] == 'string' ) {
            PB.hodnoty = data[i]
            PB.vzorky = tempData;
            PB.metada = data[i+1];
            tempData = [];
            pudniBloky.push(PB);
            PB = {};
        } else {
        }
    }

    generateJSON(pudniBloky);
}

//generovani finalniho JSONu
function generateJSON(data) {
    try {
        fs.writeFileSync(outputFile, JSON.stringify(data))
    } catch (err) {
        console.log(err)
    }
}
