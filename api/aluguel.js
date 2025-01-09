
export class AluguelApi{

    static async getFuncionario(id){
        return {
            id: id,
            matricula: "12345",
            senha: "sdfsdfasdfsadfs",
            confirmacaoSenha: "sdfsdfasdfsadfs",
            email: "user@example.com",
            nome: "Funcionário",
            idade: 32,
            funcao: "Reparador",
            cpf: "1111111111"
          }
    }
}