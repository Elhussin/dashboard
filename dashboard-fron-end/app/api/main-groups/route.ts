import sql from 'mssql';
import { NextResponse } from 'next/server';
import { config } from '../config';

export async function GET() {
    try {
        const pool = await sql.connect(config);
        const query = `
      SELECT MainGroupsID, Name
      FROM dbo.MainGroups
      GROUP BY MainGroupsID, Name
      ORDER BY Name
    `;
        const result = await pool.request().query(query);

        return NextResponse.json({
            data: result.recordset
        });
    } catch (error: any) {
        console.error("MainGroups API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
