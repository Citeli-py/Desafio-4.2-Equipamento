class ResponseHandler {
    // Resposta de sucesso
    static success(res, data = {}, statusCode = 200) {
        return res.status(statusCode).json(data);
    }

    // Resposta de erro genérico
    static error(res, statusCode, mensagem, codigo='0') {
        return res.status(statusCode).json({
            codigo: codigo,
            mensagem: mensagem,
        });
    }

    // Resposta personalizada
    static custom(res, statusCode, data = {}) {
        return res.status(statusCode).json(data);
    }
}

class ErroDadoInvalido{
    static toResponse(res, codigo, mensagem){
        return ResponseHandler.error(res, 422, mensagem, codigo);
    }
}

import fs from 'fs';
import path from 'path';

class ErroInterno{
    /**
     * Escreve um erro em um arquivo de log.
     * 
     * @param {Error} error - Objeto de erro capturado.
     * @param {string} context - Contexto ou descrição do local onde o erro ocorreu.
     */
    static logErrorToFile(error, context = '') {

        // Caminho para o arquivo de log
        const __dirname = path.resolve(); // Para obter o diretório atual
        const logFilePath = path.join(__dirname, '/log/erros.log');

        const timestamp = new Date().toISOString(); // Data e hora formatada
        const logMessage = `[${timestamp}] - ERRO:
            Contexto: ${context}
            Mensagem: ${error.message}
            Stack Trace: ${error.stack || 'N/A'}
            --------------------------------------------\n`;

        // Escreve no arquivo de log (cria se não existir)
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo de log:', err.message);
            }
        });
    }


    static toResponse(res, codigo, erro, contexto){
        // Escrever no log
        this.logErrorToFile(erro, contexto);
        return ResponseHandler.error(res, 500, "Erro no servidor", codigo);
    }
}

class ErroNaoEncontrado{

    static toResponse(res, codigo, mensagem){
        return ResponseHandler.error(res, 404,mensagem, codigo);
    }
}

class Sucesso{

    static toResponse(res, data){
        return ResponseHandler.success(res, data);
    }

}

export {ErroDadoInvalido, ErroInterno, ErroNaoEncontrado, Sucesso};
