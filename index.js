const fs = require('fs');
const csv = require('csv-parser');
const removeAccents = require('remove-accents');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const alunos = [];

fs.createReadStream('alunos.csv')
.pipe(csv({separator: ';'}))
.on('data', (row) => {
    const nomeCompleto = row['Nome do aluno'];
    const nomes = nomeCompleto.split(' ');
    const nomeUsuario = removeAccents(`${nomes[0].toLowerCase()}.${row['Matricula']}`);
    alunos.push({...row, nomeUsuario});
})
.on('end', () => {
    fs.writeFileSync('script', alunos.map(aluno => `/ip hotspot user add name="${aluno.nomeUsuario}" password="${aluno['Matricula']}" disabled=no comment="${removeAccents(aluno['Nome do aluno'])}"`).join('\n'))

    const csvWriter = createCsvWriter({
        path: 'output.csv',
        header: [
            {id: 'matricula', title: 'Matricula'},
            {id: 'nome', title: 'Nome'},
            {id: 'usuario', title: 'Usuario'},
            {id: 'senha', title: 'Senha'}
        ],
        fieldDelimiter: ';'
    });
    csvWriter.writeRecords(alunos.map(aluno => ({matricula: aluno.Matricula, nome: aluno['Nome do aluno'], usuario: aluno.nomeUsuario, senha: aluno['Matricula']})))
})