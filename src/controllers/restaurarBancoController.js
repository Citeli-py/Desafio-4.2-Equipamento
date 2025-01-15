import { Sucesso, ErroInterno } from '../util/responseHandler.js';
import { RestaurarBancoService } from '../services/restaurarBancoService.js';

export class RestaurarBancoController {

    static async restaurarBanco(req, res){
        try {
            await RestaurarBancoService.restaurarBanco();
            return Sucesso.toResponse(res, {});
        } catch (error) {
            return ErroInterno.toResponse(res, '500', error, 'Restaurar banco');
        }
    }
};