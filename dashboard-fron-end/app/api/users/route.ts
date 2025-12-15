// app/api/users/route.js (هذا الكود يعمل على الخادم فقط)

import sql from 'mssql';
import { NextResponse, NextRequest } from 'next/server';
import { config } from '../config';


export async function GET(request: NextRequest) {
    try {
        // 1. إنشاء الاتصال بقاعدة البيانات
        const pool = await sql.connect(config);

        const yearParam = request.nextUrl.searchParams.get('Year');
        const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

        const reportQuery = `
    SELECT TOP (100) PERCENT dbo.Gallery.Name, 
           CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE 1 END AS Insurance, 
           SUM(dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) AS [T.price], 
           SUM(ISNULL(dbo.CustomerOrderDetails.InsuranceDiscount + ISNULL(CASE WHEN InsuranceCompanyId = 230 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN ApprovePrice * .4 ELSE 0 END END, 0) 
           + ISNULL(CASE WHEN InsuranceCompanyId = 1 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN ApprovePrice * .32 ELSE 0 END END, 0) 
           + ISNULL(CASE WHEN InsuranceCompanyId = 18 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN (ApprovePrice - (CASE WHEN dbo.CustomerOrder.approveamount = 0 THEN 0 ELSE dbo.CustomerOrderDetails.ApprovePrice
           / dbo.CustomerOrder.approveamount * dbo.CustomerOrder.Deductible END)) * .3 ELSE 0 END END, 0) 
           + (CASE WHEN InsuranceCompanyId = 230 THEN ((dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) - (CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE ApprovePrice END)) * .27 ELSE 0 END),
           0)) AS InsuranceDiscount, 
           SUM(dbo.CustomerOrderDetails.Discount * (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) / 100) AS CACHDiscount, 
           SUM(CASE WHEN InsuranceCompanyId IS NULL 
           THEN (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) - (dbo.CustomerOrderDetails.Discount * (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) / 100) 
           ELSE dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity - CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE ApprovePrice END END) AS DIFRENT, 
           SUM(CASE WHEN dbo.CustomerOrder.approveamount = 0 THEN 0 ELSE dbo.CustomerOrderDetails.ApprovePrice / dbo.CustomerOrder.approveamount * dbo.CustomerOrder.Deductible END) AS Deductible1, 
           SUM(ISNULL(dbo.CustomerOrderDetails.InsuranceDiscount, 0)) AS Expr1, 
           SUM(ISNULL(CASE WHEN InsuranceCompanyId = 230 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN ApprovePrice * .4 ELSE 0 END END, 0)) AS PUPADESCOUNT, 
           SUM(CASE WHEN InsuranceCompanyId = 230 THEN ((dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) - (CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE ApprovePrice END)) 
           * .27 ELSE 0 END) AS [puba .27], 
           SUM(ISNULL(CASE WHEN InsuranceCompanyId = 1 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN ApprovePrice * .32 ELSE 0 END END, 0)) AS TAW, 
           SUM(ISNULL(CASE WHEN InsuranceCompanyId = 18 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN (ApprovePrice - (CASE WHEN dbo.CustomerOrder.approveamount = 0 THEN 0 ELSE dbo.CustomerOrderDetails.ApprovePrice
           / dbo.CustomerOrder.approveamount * dbo.CustomerOrder.Deductible END)) * .3 ELSE 0 END END, 0)) AS AXA, 
           SUM(dbo.CustomerOrderDetails.Quantity) AS Quantity, 
           SUM(CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE ApprovePrice END) AS ApprovePrice, 
           dbo.CustomerOrder.Trans_Year, 
           dbo.Gallery.GalleryID
    FROM dbo.CustomerOrderDetails 
    INNER JOIN dbo.CustomerOrder ON dbo.CustomerOrderDetails.CustomerOrderID = dbo.CustomerOrder.CustomerOrderID 
    INNER JOIN dbo.Gallery ON dbo.CustomerOrder.GalleryID = dbo.Gallery.GalleryID 
    INNER JOIN dbo.Product ON dbo.CustomerOrderDetails.ProductID = dbo.Product.ProductID 
    INNER JOIN dbo.MainGroups ON dbo.Product.MainGroupID = dbo.MainGroups.MainGroupsID
    WHERE (NOT (dbo.CustomerOrder.CustomerOrderID IN
             (SELECT CustomerOrderID FROM dbo.CustomerRevoke)))
    GROUP BY dbo.CustomerOrder.Trans_Year, CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE 1 END, dbo.Gallery.GalleryID, dbo.Gallery.Name
   HAVING (dbo.CustomerOrder.Trans_Year = @Year);
    `;
        console.log("year", year);
        const result = await pool.request()
            .input('Year', sql.Int, year)
            .query(reportQuery);
        console.log("result", result);
        await pool.close();

        return NextResponse.json({
            message: 'Data fetched successfully',
            data: result.recordset
        });

    } catch (err) {

        console.error('SQL Error:', err);
        // إرجاع رسالة خطأ مع رمز 500 في حالة فشل الاتصال أو الاستعلام
        return new NextResponse(JSON.stringify({
            error: 'Failed to connect or query database',
            details: err instanceof Error ? err.message : String(err)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}