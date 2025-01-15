import Database from "../db/Database.js";

export class RestaurarBancoService{

    static async restaurarBanco(){
        await Database.conexao.sync({force: true});
    }
};