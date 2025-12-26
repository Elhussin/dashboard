// app/api/users/route.js (هذا الكود يعمل على الخادم فقط)

import sql from 'mssql';
import { NextResponse, NextRequest } from 'next/server';
import { config } from '../config';


export async function GET(request: NextRequest) {
    try {
        // 1. Establish database connection
        const pool = await sql.connect(config);

        const startDateParam = request.nextUrl.searchParams.get('startDate');
        const endDateParam = request.nextUrl.searchParams.get('endDate');
        const storeIdParam = request.nextUrl.searchParams.get('storeId');
        const galleryIdParam = request.nextUrl.searchParams.get('galleryId');
        const paymentTypeParam = request.nextUrl.searchParams.get('paymentType');

        // Validation - ensure dates are provided
        if (!startDateParam || !endDateParam) {
            return NextResponse.json({
                error: 'startDate and endDate parameters are required'
            }, { status: 400 });
        }

        const reportQuery = `
            SELECT
                dbo.Gallery.Name,
                CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE 1 END AS Insurance,

                SUM(dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) AS [T.price],

                SUM(
                    ISNULL(
                        dbo.CustomerOrderDetails.InsuranceDiscount
                        + ISNULL(CASE 
                            WHEN InsuranceCompanyId = 230 
                                AND dbo.CustomerOrderDetails.InsuranceDiscount = 0 
                            THEN ApprovePrice * 0.4 ELSE 0 END, 0)
                        + ISNULL(CASE 
                            WHEN InsuranceCompanyId = 1 
                                AND dbo.CustomerOrderDetails.InsuranceDiscount = 0 
                            THEN ApprovePrice * 0.32 ELSE 0 END, 0)
                        + ISNULL(CASE 
                            WHEN InsuranceCompanyId = 18 
                                AND dbo.CustomerOrderDetails.InsuranceDiscount = 0 
                            THEN (ApprovePrice -
                                (CASE 
                                    WHEN dbo.CustomerOrder.approveamount = 0 THEN 0
                                    ELSE dbo.CustomerOrderDetails.ApprovePrice
                                        / dbo.CustomerOrder.approveamount
                                        * dbo.CustomerOrder.Deductible
                                END)) * 0.3
                            ELSE 0 END, 0)
                        + CASE 
                            WHEN InsuranceCompanyId = 230 
                            THEN ((dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity)
                                - ISNULL(ApprovePrice, 0)) * 0.27
                            ELSE 0 END
                    ,0)
                ) AS InsuranceDiscount,

                SUM(dbo.CustomerOrderDetails.Discount
                    * (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) / 100) AS CACHDiscount,

                SUM(CASE
                    WHEN InsuranceCompanyId IS NULL THEN
                        (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity)
                        - (dbo.CustomerOrderDetails.Discount
                        * (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) / 100)
                    ELSE
                        (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity)
                        - ApprovePrice
                END) AS DIFRENT,

                SUM(CASE
                    WHEN dbo.CustomerOrder.approveamount = 0 THEN 0
                    ELSE dbo.CustomerOrderDetails.ApprovePrice
                        / dbo.CustomerOrder.approveamount
                        * dbo.CustomerOrder.Deductible
                END) AS Deductible1,

                SUM(ISNULL(dbo.CustomerOrderDetails.InsuranceDiscount, 0)) AS Expr1,

                SUM(CASE
                    WHEN InsuranceCompanyId = 230
                        AND dbo.CustomerOrderDetails.InsuranceDiscount = 0
                    THEN ApprovePrice * 0.4 ELSE 0
                END) AS PUPADESCOUNT,

                SUM(CASE
                    WHEN InsuranceCompanyId = 230
                    THEN ((dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity)
                        - ISNULL(ApprovePrice, 0)) * 0.27
                    ELSE 0
                END) AS [puba .27],

                SUM(CASE
                    WHEN InsuranceCompanyId = 1
                        AND dbo.CustomerOrderDetails.InsuranceDiscount = 0
                    THEN ApprovePrice * 0.32 ELSE 0
                END) AS TAW,

                SUM(CASE
                    WHEN InsuranceCompanyId = 18
                        AND dbo.CustomerOrderDetails.InsuranceDiscount = 0
                    THEN (ApprovePrice -
                        (CASE
                            WHEN dbo.CustomerOrder.approveamount = 0 THEN 0
                            ELSE dbo.CustomerOrderDetails.ApprovePrice
                                / dbo.CustomerOrder.approveamount
                                * dbo.CustomerOrder.Deductible
                        END)) * 0.3
                    ELSE 0
                END) AS AXA,

                SUM(dbo.CustomerOrderDetails.Quantity) AS Quantity,
                SUM(CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE ApprovePrice END) AS ApprovePrice,

                dbo.CustomerOrder.Trans_Year,
                dbo.Gallery.GalleryID

            FROM dbo.CustomerOrderDetails
            INNER JOIN dbo.CustomerOrder
                ON dbo.CustomerOrderDetails.CustomerOrderID = dbo.CustomerOrder.CustomerOrderID
            INNER JOIN dbo.Gallery
                ON dbo.CustomerOrder.GalleryID = dbo.Gallery.GalleryID
            INNER JOIN dbo.Product
                ON dbo.CustomerOrderDetails.ProductID = dbo.Product.ProductID
            INNER JOIN dbo.MainGroups
                ON dbo.Product.MainGroupID = dbo.MainGroups.MainGroupsID

            WHERE
                NOT EXISTS (
                    SELECT 1
                    FROM dbo.CustomerRevoke CR
                    WHERE CR.CustomerOrderID = dbo.CustomerOrder.CustomerOrderID
                )
                AND dbo.CustomerOrder.OrderDate >= @StartDate
                AND dbo.CustomerOrder.OrderDate <= @EndDate
                ${storeIdParam ? 'AND dbo.CustomerOrder.StoreID = @StoreId' : ''}
                ${galleryIdParam ? 'AND dbo.CustomerOrder.GalleryID = @GalleryId' : ''}
                ${paymentTypeParam === 'cash' ? 'AND InsuranceCompanyId IS NULL' : ''}
                ${paymentTypeParam === 'insurance' ? 'AND InsuranceCompanyId IS NOT NULL' : ''}

            GROUP BY
                dbo.CustomerOrder.Trans_Year,
                CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE 1 END,
                dbo.Gallery.GalleryID,
                dbo.Gallery.Name
        `;

        const dbRequest = pool.request()
            .input('StartDate', sql.Date, startDateParam)
            .input('EndDate', sql.Date, endDateParam);

        if (storeIdParam) dbRequest.input('StoreId', sql.Int, storeIdParam);
        if (galleryIdParam) dbRequest.input('GalleryId', sql.Int, galleryIdParam);

        const result = await dbRequest.query(reportQuery);

        await pool.close();

        return NextResponse.json({
            message: 'Data fetched successfully',
            data: result.recordset
        });

    } catch (err) {

        console.error('SQL Error:', err);
        return new NextResponse(JSON.stringify({
            error: 'Failed to connect or query database',
            details: err instanceof Error ? err.message : String(err)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}