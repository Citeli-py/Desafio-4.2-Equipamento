import { Op } from 'sequelize';
import { Tranca } from "../models/Tranca.js"  

export class TrancaRepo {

    static async getTranca(id){
        try{
            return await Tranca.findOne({
                where: {
                    id,
                    status: { [Op.ne]: 'EXCLUIDA' },
                },
            });
        } catch(error){
            throw error;
        }
    }

    static async getAllTrancas() {
        try {
            return await Tranca.findAll({
                attributes: ["id", "bicicleta", "numero", "localizacao", "anoDeFabricacao", "modelo", "status"],
                where: {
                    status: { [Op.ne]: 'EXCLUIDA' },
                },
            });
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Esse metodo tranca a Tranca, alterando seu status para OCUPADA e associando uma bicicleta a ela, 
     * essa bicicleta tem seu status trocado para disponível
     * 
     * @param {Tranca} tranca - Tranca que será trancada
     * @param {Bicicleta} bicicleta  - Bicicleta que sera presa na tranca
     */
    static async trancar(tranca, bicicleta=null){
    
        if (bicicleta){
            tranca.bicicleta = bicicleta.id;
            bicicleta.status = "DISPONIVEL";
            await bicicleta.save();
        }
        
        tranca.status = "OCUPADA";
        await tranca.save();
    }

    /**
     * Metodo para destrancar a tranca, retirando a associação com uma bicicleta e alterando seu status para LIVRE
     */
    static async destrancar(tranca){
        tranca.bicicleta = null;
        tranca.status = "LIVRE";
        await tranca.save()
    }

    /**
     * Verifica se existe uma bicicleta na tranca, caso uma bicicleta for parametro verifica se aquela bicicleta está na tranca
     * 
     * @param {Tranca} tranca - Tranca
     * @param {Bicicleta} bicicleta - Bicicleta que pode estar na tranca
     * @returns {boolean} - Se existir uma bicicleta na tranca retorna true
     */
    static isBicicletaNaTranca(tranca, bicicleta=null){
        if(bicicleta)
            return tranca.bicicleta === bicicleta.id;

        return tranca.bicicleta !== null;
    }
}
