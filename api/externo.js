
export class ExternoApi{

    /**
     * Chama o micro serviço externo e envia um email
     * @param {string} email - endereço de email do destinatário
     * @param {string} assunto - Assunto do email
     * @param {string} mensagem - Corpo do email
     * @returns {{id: number, email: string, assunto: string, mensagem: string}} - retorna um email
     */
    static async enviarEmail(email, assunto, mensagem){
        return {
            id: 0,
            email: email,
            assunto: assunto,
            mensagem: mensagem
        }
    }
}