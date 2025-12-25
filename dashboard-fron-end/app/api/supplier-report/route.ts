import sql from 'mssql';
import { NextResponse, NextRequest } from 'next/server';
import { config } from '../config';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const Trans_Year = searchParams.get("Trans_Year");
        const MainGroupID = searchParams.get("MainGroupID");
        const SupplierID = searchParams.get("SupplierID");

        const pool = await sql.connect(config);
        const req = pool.request();

        // Build dynamic WHERE
        const filters: string[] = [];

        // Helper to add 'IN' clause parameters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addInClause = (paramName: string, paramValue: string | null, column: string, type: any) => {
            if (!paramValue) return;

            const values = paramValue.split(',').map(v => v.trim()).filter(v => v);
            if (values.length === 0) return;

            const paramNames = values.map((_v, i) => `@${paramName}${i}`);
            values.forEach((v, i) => {
                req.input(`${paramName}${i}`, type, v);
            });

            filters.push(`${column} IN (${paramNames.join(', ')})`);
        };

        addInClause('Year', Trans_Year, 'dbo.SupplierInvoice.Trans_Year', sql.Int);
        addInClause('MainGroup', MainGroupID, 'dbo.Product.MainGroupID', sql.Int);
        addInClause('Supplier', SupplierID, 'dbo.Supplier.SupplierID', sql.Int);

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const query = `
      SELECT TOP (100) PERCENT 
        dbo.Supplier.Name,
        dbo.SupplierInvoice.Trans_Year,
        dbo.SupplierInvoice.InvoiceDate,
        dbo.Product.Code,
        dbo.Product.Description,
        dbo.Product.CostPrice,
        dbo.Product.RetailPrice,
        dbo.SupplierInvoiceDetails.Quantity, 
        dbo.SupplierInvoiceDetails.PurchaseBasePrice, 
        dbo.Product.MainGroupID
      FROM dbo.SupplierInvoice
      INNER JOIN dbo.Supplier ON dbo.SupplierInvoice.SupplierID = dbo.Supplier.SupplierID
      INNER JOIN dbo.SupplierInvoiceDetails ON dbo.SupplierInvoice.SupplierInvoiceID = dbo.SupplierInvoiceDetails.SupplierInvoiceID
      INNER JOIN dbo.Product ON dbo.SupplierInvoiceDetails.ProductID = dbo.Product.ProductID
      ${whereClause}
      ORDER BY dbo.SupplierInvoice.InvoiceDate, dbo.Product.Code
    `;

        const result = await req.query(query);
        return NextResponse.json({
            message: 'Data fetched successfully',
            data: result.recordset
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}

