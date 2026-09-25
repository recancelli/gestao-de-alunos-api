import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { getTokenAdmin, getToken } from '../helpers/auth.js';
import { limparDadosDoFixture } from '../helpers/limpeza.js';
import testesDeEntregaDeTrabalho from '../fixtures/entregaTrabalho.json' with {type: 'json' };
import testesDeEntregaDeTrabalhoSemMatricula from '../fixtures/entregaTrabalhoSemMatricula.json' with {type: 'json' };

describe('Entrega de Trabalho', () => {

    beforeEach(async () => {
        await limparDadosDoFixture(testesDeEntregaDeTrabalho, await getTokenAdmin());
    })

    testesDeEntregaDeTrabalho.forEach((testeDeEntregaDeTrabalho) => {
        it(testeDeEntregaDeTrabalho.testeTitulo, async () => {
            // ARANGE 
            const tokenAdmin = await getTokenAdmin();

            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(testeDeEntregaDeTrabalho.dadoAluno);

            const alunoId = cadastroAlunoResposta.body.id;

            const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(testeDeEntregaDeTrabalho.dadoDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;

            const cadastroMatriculaResposta = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send({
                    alunoId: alunoId
                });

            const tokenAluno = await getToken(testeDeEntregaDeTrabalho.dadoAluno.email, testeDeEntregaDeTrabalho.dadoAluno.senha);

            // ACT
            const entregaTrabalhoResposta = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAluno)
                .send({ ...testeDeEntregaDeTrabalho.dadoTrabalho, disciplinaId: disciplinaId });

            // ASSERT
            expect(entregaTrabalhoResposta.status).to.equal(Number(testeDeEntregaDeTrabalho.statusCodeEsperado));

        })
    })

    testesDeEntregaDeTrabalhoSemMatricula.forEach((testeDeEntregaDeTrabalhoSemMatricula) => {
        it(testeDeEntregaDeTrabalhoSemMatricula.testeTitulo, async () => {
            // ARANGE 
            const tokenAdmin = await getTokenAdmin();

            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(testeDeEntregaDeTrabalhoSemMatricula.dadoAluno);

            const alunoId = cadastroAlunoResposta.body.id;

            const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(testeDeEntregaDeTrabalhoSemMatricula.dadoDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;

            const tokenAluno = await getToken(testeDeEntregaDeTrabalhoSemMatricula.dadoAluno.email, testeDeEntregaDeTrabalhoSemMatricula.dadoAluno.senha);

            // ACT
            const entregaTrabalhoResposta = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAluno)
                .send({ ...testeDeEntregaDeTrabalhoSemMatricula.dadoTrabalho, disciplinaId: disciplinaId });

            // ASSERT
            expect(entregaTrabalhoResposta.status).to.equal(Number(testeDeEntregaDeTrabalhoSemMatricula.statusCodeEsperado));

        })
    })
})