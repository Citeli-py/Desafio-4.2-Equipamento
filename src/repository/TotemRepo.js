import { Op, Sequelize, Transaction, ValidationError } from 'sequelize';
import { Totem } from '../models/Totem.js';


export class TotemRepo {

    static async getTotem(id){
        try{
            return await Totem.findByPk(id);
        } catch(error){
            throw error;
        }
    }

}
