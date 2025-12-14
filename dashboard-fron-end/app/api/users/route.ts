// app/api/users/route.js (هذا الكود يعمل على الخادم فقط)

import sql from 'mssql';
import { NextResponse, NextRequest } from 'next/server';
const year = 2024; // يمكن جلبها من request.nextUrl.searchParams.get('year')
// إعدادات الاتصال يتم جلبها من متغيرات البيئة
const config = {
    user: process.env.SQL_SERVER_USER!,
    password: process.env.SQL_SERVER_PASSWORD!,
    database: process.env.SQL_SERVER_DATABASE!,
    server: process.env.SQL_SERVER_HOST!,
    port: parseInt(process.env.SQL_SERVER_PORT || "1433"), // تحويل المنفذ إلى رقم
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true, // قد تحتاجها في بيئات التطوير
        encrypt: true, // هام للاتصال عبر الإنترنت
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1',
            ciphers: 'DEFAULT@SECLEVEL=0'
        } as any
    }
};

// دالة لمعالجة طلب GET (لجلب البيانات)
export async function GET(request: NextRequest) {
    try {
        // 1. إنشاء الاتصال بقاعدة البيانات
        const pool = await sql.connect(config);
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
        // 2. تنفيذ الاستعلام
        // مثال: جلب أول 10 مستخدمين
        // const result = await pool.request().query(reportQuery);
        // console.log("result", result);

        const result = await pool.request()
            // تعريف نوع المعامل
            .input('Year', sql.Int, year) 
            // تنفيذ الاستعلام
            .query(reportQuery);
        console.log("result", result);
        // 3. إغلاق الاتصال (اختياري، المكتبة تتعامل مع التجميع)
        await pool.close();

        // 4. إرجاع البيانات كاستجابة JSON إلى الواجهة الأمامية
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