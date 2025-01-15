import axios from 'axios';

export class AluguelApi {
    static url = "http://20.226.53.175:8001/turma-node-grupo-4-aluguel/funcionario";
    //static url = "http://localhost:3000/funcionario";

    /**
     * Busca informações de um funcionário por ID.
     * @param {string} id - ID do funcionário a ser buscado.
     * @returns {Promise<Object>} - Dados do funcionário ou erro.
     */
    static async getFuncionario(id) {
        try {
            const response = await axios.get(`${this.url}/${id}`, { timeout: 5000 });
            return response.data; // Retorna os dados do funcionário.

        } catch (error) {

            // Não encontrou funcionário
            if (error.code === "ERR_BAD_REQUEST") 
                return null

            // Retorna um erro genérico em caso de falha na requisição.
            throw new Error('Erro ao conectar com a API.');
        }
    }
}
