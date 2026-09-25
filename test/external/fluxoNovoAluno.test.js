import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import { limparDadosDoFixture } from '../helpers/limpeza.js';
import testesNovoAluno from '../fixtures/novoAluno.json' with {type: 'json' };

describe('Novo aluno', () => {

    before(async () => {
        await limparDadosDoFixture(testesNovoAluno, await getTokenAdmin());
    })

    testesNovoAluno.forEach((testeNovoAluno) => {
        it(testeNovoAluno.testeTitulo, async () => {
            // ARANGE 
            const tokenAdmin = await getTokenAdmin();

            await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(testeNovoAluno.dadoAluno);


            const loginResposta = await api()
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: testeNovoAluno.dadoAluno.email,
                    senha: testeNovoAluno.dadoAluno.senha
                });

            expect(loginResposta.status).to.equal(Number(testeNovoAluno.statusCodeEsperado));

        })
    })
})