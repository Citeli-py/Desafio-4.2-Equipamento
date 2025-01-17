import axios from 'axios';

export class ExternoApi {
    static url = "http://20.226.53.175:8001/turma-node-grupo-4-externo/enviarEmail";

    /**
     * 
     * @param {string} email 
     * @param {string} assunto 
     * @param {string} mensagem 
     * @returns {Promise<Object>} 
     */
    static async enviarEmail(email, assunto, mensagem) {
        try {
            const response = await axios.post(this.url, {
                email: email,
                assunto: assunto,
                mensagem: mensagem
            }, {
                timeout: 5000
            });

            // Dados válidos do email
            return response.data;
        } catch (error) {
                throw new Error(`Erro inesperado: ${error.message}`);
            }
    }
}