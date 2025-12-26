import sql from 'mssql';
import { NextResponse } from 'next/server';
import { config } from '../config';

export async function GET() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT StoreID, Name FROM dbo.Store');

        // Always close the connection
        await pool.close();

        return NextResponse.json(result.recordset);
    } catch (err) {
        console.error('SQL Error:', err);
        return new NextResponse(JSON.stringify({
            error: 'Failed to fetch stores',
            details: err instanceof Error ? err.message : String(err)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
