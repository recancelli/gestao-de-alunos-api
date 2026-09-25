import { api } from './api.js';

export async function limparDadosDoFixture(testes, tokenAdmin) {
    const alunosResposta = await api()
        .get('/api/admin/alunos')
        .set('Authorization', tokenAdmin);

    const disciplinasResposta = await api()
        .get('/api/admin/disciplinas')
        .set('Authorization', tokenAdmin);

    for (const teste of testes) {
        const aluno = teste.dadoAluno
            ? alunosResposta.body.find(({ email }) => email === teste.dadoAluno.email)
            : null;
        const disciplina = teste.dadoDisciplina
            ? disciplinasResposta.body.find(({ nome }) => nome === teste.dadoDisciplina.nome)
            : null;

        if (aluno) {
            await api()
                .delete(`/api/admin/alunos/${aluno.id}`)
                .set('Authorization', tokenAdmin);
        }

        if (disciplina) {
            await api()
                .delete(`/api/admin/disciplinas/${disciplina.id}`)
                .set('Authorization', tokenAdmin);
        }
    }
}
