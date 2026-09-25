import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';


describe('Login', () => {
    let token;

    beforeEach(async () => {
        token = await getTokenAdmin();
    });

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        const aluno = novoAluno();
        await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(aluno);

        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(aluno);

        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');

    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        const aluno = novoAluno();
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(aluno);

        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal(aluno.nome);
        expect(cadastroAlunoResposta.body.email).to.equal(aluno.email);
        expect(cadastroAlunoResposta.body.matricula).to.equal(aluno.matricula);

    });
});