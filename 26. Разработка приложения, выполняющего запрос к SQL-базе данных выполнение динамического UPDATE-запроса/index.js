const sql = require('mssql/msnodesqlv8');

const dbConfig = {
    "driver": "msnodesqlv8",
    "connectionString": "Driver={SQL Server Native Client 11.0};Server={DESKTOP-RFSFAJA\\SQLEXPRESS};Database={MIM};Trusted_Connection={yes};"
};

const connectionPool = new sql.ConnectionPool(dbConfig);

const TableName = 'Faculty';
const FieldId = 'Faculty_Id';
const FieldIdValue = 1;
const FieldToUpdate = 'Faculty_Name';
const NewFieldValue = 'Test01';

connectionPool.connect().then(pool => {
    return pool.query(
        `UPDATE ${TableName} 
            SET ${FieldToUpdate} = '${NewFieldValue}'
            WHERE ${FieldId} = ${FieldIdValue}`
    );
}).then(result => {
    console.log('Result: ' + JSON.stringify(result, null, ' '));
    console.log('Field has updated');
    connectionPool.close();
});
