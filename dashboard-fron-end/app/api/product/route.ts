// app/api/users/route.js (هذا الكود يعمل على الخادم فقط)

import sql from 'mssql';
import { NextResponse, NextRequest } from 'next/server';
import { config } from '../config';


export async function GET(request: NextRequest) {
    try {
        // 1. إنشاء الاتصال بقاعدة البيانات
        const pool = await sql.connect(config);
        const store = request.nextUrl.searchParams.get('Store') || "Jeddah Store";
        const mainGroup = request.nextUrl.searchParams.get('MainGroup') || "58";

        const yearParam = request.nextUrl.searchParams.get('Year');
        const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
        
        const reportQuery=`
        SELECT dbo.v_ItemCardtaha.Code, dbo.v_ItemCardtaha.Description, SUM(dbo.v_ItemCardtaha.Incoming - dbo.v_ItemCardtaha.Outgoing) AS Expr1, dbo.Product.CostPrice, dbo.Product.RetailPrice
            FROM    dbo.v_ItemCardtaha INNER JOIN dbo.Product ON dbo.v_ItemCardtaha.Code = dbo.Product.Code
            WHERE        (dbo.v_ItemCardtaha.DepName = N'Jeddah Store') AND (dbo.v_ItemCardtaha.MainGroupID = 38 OR dbo.v_ItemCardtaha.MainGroupID = 58)
            GROUP BY dbo.v_ItemCardtaha.Description, dbo.v_ItemCardtaha.Code, dbo.Product.RetailPrice, dbo.Product.CostPrice
            HAVING (SUM(dbo.v_ItemCardtaha.Incoming - dbo.v_ItemCardtaha.Outgoing) <> 0)
        `

        console.log("year", year);
        const result = await pool.request()
            .input('Store', sql.NVarChar, store)
            // .input('MainGroup', sql.Int, mainGroup) // Removed MainGroup parameter to force 38 or 58 as per raw query
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


// SELECT DepartmentID, Name, [Order]
// FROM abohossam.dbo.Department;


// SELECT GalleryID, Name, Address, Phones, GalleryMasterID, dtCreateDate, sinCreateUserID, dtUpdateDate, sinUpdateUserID, CurrencyID, DiscountPercentage, RegionID, SystemDepartmentID, Extension, Responsible, CashAccountNo, CreditAccountNo, RemainsAccountNo, SalesAccountNo, DownPaymentAccountNo, BeginningBalance, Bankcommissions, GalleryCode
// FROM abohossam.dbo.Gallery;