import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import { limparDadosDoFixture } from '../helpers/limpeza.js';
import testesMatricula from '../fixtures/matriculaDisciplina.json' with {type: 'json' };

describe('Matrícula de Aluno em Disciplina', () => {
    // ANTES DE RODAR ESSE IT:
    // - Tenha o email admin@escola.com e a senha admin123 cadastrados no banco
    // - Não ter no banco de dados uma aluna com email ana.souza.1004@example.com e a matricula 202401004
    // - Não ter uma disciplina com o código PC1004
    before(async () => {
        await limparDadosDoFixture(testesMatricula, await getTokenAdmin());
    })

    testesMatricula.forEach((testeMatricula) => {
        it(testeMatricula.testeTitulo, async () => {
            // ARRANGE
            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await getTokenAdmin())
                .send(testeMatricula.dadoAluno);

            const alunoId = cadastroAlunoResposta.body.id;

            const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', await getTokenAdmin())
                .send(testeMatricula.dadoDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;

            // ACT
            const cadastroMatriculaResposta = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await getTokenAdmin())
                .send({
                    alunoId: alunoId
                });

            // ASSERT
            expect(cadastroMatriculaResposta.status).to.equal(Number(testeMatricula.statusCodeEsperado));
            expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
            expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
        })
    })
});