export const config = {
    user: process.env.SQL_SERVER_USER!,
    password: process.env.SQL_SERVER_PASSWORD!,
    database: process.env.SQL_SERVER_DATABASE!,
    server: process.env.SQL_SERVER_HOST!,
    port: parseInt(process.env.SQL_SERVER_PORT || "1433"),
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true,
        encrypt: true,
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1',
            ciphers: 'DEFAULT@SECLEVEL=0'
        } as any
    }
};
