import * as sql from 'mssql';
import { product, SQLconfig } from '../types';


class MSSQL {
    private sql: any;
    private config: SQLconfig;

    constructor(config: SQLconfig) {
        this.config = config;
        this.sql = require('mssql');
    }

    async insertData(tableName: string, data: product[]) {
        try {
            await this.sql.connect(this.config);
            let columns: (keyof product)[] = Object.keys(data[0]) as (keyof product)[];
            let columnString = columns.join(', ');
            let valueString = '@' + columns[0];
            for (let i = 1; i < columns.length; i++) {
                valueString += ', @' + columns[i];
            }
            let request = new this.sql.Request();
            data.forEach((row: product) => {
                columns.forEach(col => {
                    request.input(col, this.sql.VarChar, row[col]);
                });
                request.query(`INSERT INTO ${tableName} (${columnString}) VALUES (${valueString})`);
            });
            console.log("Data inserted successfully!");
        } catch (err) {
            console.log(err);
        }
    }
}

const config: SQLconfig = {
    user: 'your-username',
    password: 'your-password',
    server: 'your-server-name',
    database: 'your-database-name',
    options: {
        encrypt: true
    }
}

const database = new MSSQL(config);

database.insertData('your-table-name', [])