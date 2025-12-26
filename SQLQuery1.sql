-- hussam Qyerys
-- # saler per yearr
SELECT TOP (100) PERCENT dbo.Gallery.Name, CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE 1 END AS Insurance, SUM(dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) AS [T.price], 
                         SUM(ISNULL(dbo.CustomerOrderDetails.InsuranceDiscount + ISNULL(CASE WHEN InsuranceCompanyId = 230 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN ApprovePrice * .4 ELSE 0 END END, 0) 
                         + ISNULL(CASE WHEN InsuranceCompanyId = 1 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN ApprovePrice * .32 ELSE 0 END END, 0) 
                         + ISNULL(CASE WHEN InsuranceCompanyId = 18 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN (ApprovePrice - (CASE WHEN dbo.CustomerOrder.approveamount = 0 THEN 0 ELSE dbo.CustomerOrderDetails.ApprovePrice
                          / dbo.CustomerOrder.approveamount * dbo.CustomerOrder.Deductible END)) * .3 ELSE 0 END END, 0) 
                         + (CASE WHEN InsuranceCompanyId = 230 THEN ((dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) - (CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE ApprovePrice END)) * .27 ELSE 0 END),
                          0)) AS InsuranceDiscount, SUM(dbo.CustomerOrderDetails.Discount * (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) / 100) AS CACHDiscount, SUM(CASE WHEN InsuranceCompanyId IS NULL 
                         THEN (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) - (dbo.CustomerOrderDetails.Discount * (dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) / 100) 
                         ELSE dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity - CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE ApprovePrice END END) AS DIFRENT, 
                         SUM(CASE WHEN dbo.CustomerOrder.approveamount = 0 THEN 0 ELSE dbo.CustomerOrderDetails.ApprovePrice / dbo.CustomerOrder.approveamount * dbo.CustomerOrder.Deductible END) AS Deductible1, 
                         SUM(ISNULL(dbo.CustomerOrderDetails.InsuranceDiscount, 0)) AS Expr1, 
                         SUM(ISNULL(CASE WHEN InsuranceCompanyId = 230 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN ApprovePrice * .4 ELSE 0 END END, 0)) AS PUPADESCOUNT, 
                         SUM(CASE WHEN InsuranceCompanyId = 230 THEN ((dbo.CustomerOrderDetails.UnitPrice * dbo.CustomerOrderDetails.Quantity) - (CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE ApprovePrice END)) 
                         * .27 ELSE 0 END) AS [puba .27], SUM(ISNULL(CASE WHEN InsuranceCompanyId = 1 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN ApprovePrice * .32 ELSE 0 END END, 0)) AS TAW, 
                         SUM(ISNULL(CASE WHEN InsuranceCompanyId = 18 THEN CASE WHEN dbo.CustomerOrderDetails.InsuranceDiscount = 0 THEN (ApprovePrice - (CASE WHEN dbo.CustomerOrder.approveamount = 0 THEN 0 ELSE dbo.CustomerOrderDetails.ApprovePrice
                          / dbo.CustomerOrder.approveamount * dbo.CustomerOrder.Deductible END)) * .3 ELSE 0 END END, 0)) AS AXA, SUM(dbo.CustomerOrderDetails.Quantity) AS Quantity, SUM(CASE WHEN InsuranceCompanyId IS NULL 
                         THEN 0 ELSE ApprovePrice END) AS ApprovePrice, dbo.CustomerOrder.Trans_Year, dbo.Gallery.GalleryID
FROM            dbo.CustomerOrderDetails INNER JOIN
                         dbo.CustomerOrder ON dbo.CustomerOrderDetails.CustomerOrderID = dbo.CustomerOrder.CustomerOrderID INNER JOIN
                         dbo.Gallery ON dbo.CustomerOrder.GalleryID = dbo.Gallery.GalleryID INNER JOIN
                         dbo.Product ON dbo.CustomerOrderDetails.ProductID = dbo.Product.ProductID INNER JOIN
                         dbo.MainGroups ON dbo.Product.MainGroupID = dbo.MainGroups.MainGroupsID
WHERE        (NOT (dbo.CustomerOrder.CustomerOrderID IN
                             (SELECT        CustomerOrderID
                                FROM            dbo.CustomerRevoke)))
GROUP BY dbo.CustomerOrder.Trans_Year, CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE 1 END, dbo.Gallery.GalleryID, dbo.Gallery.Name
HAVING        (dbo.CustomerOrder.Trans_Year = 2024)


--  pear month 
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
    AND dbo.CustomerOrder.OrderDate >= DATEFROMPARTS(2025, 1, 1)
    AND dbo.CustomerOrder.OrderDate <  DATEFROMPARTS(2025, 2, 1)

GROUP BY
    dbo.CustomerOrder.Trans_Year,
    CASE WHEN InsuranceCompanyId IS NULL THEN 0 ELSE 1 END,
    dbo.Gallery.GalleryID,
    dbo.Gallery.Name

HAVING dbo.CustomerOrder.Trans_Year = 2025;



-- # supplier per yearr
SELECT TOP (100) PERCENT dbo.Supplier.Name, dbo.SupplierInvoice.Trans_Year, dbo.SupplierInvoice.InvoiceDate, dbo.Product.Code, dbo.Product.Description, dbo.Product.CostPrice, dbo.Product.RetailPrice, dbo.SupplierInvoiceDetails.Quantity, 
             dbo.SupplierInvoiceDetails.PurchaseBasePrice, dbo.Product.MainGroupID
FROM   dbo.SupplierInvoice INNER JOIN
             dbo.Supplier ON dbo.SupplierInvoice.SupplierID = dbo.Supplier.SupplierID INNER JOIN
             dbo.SupplierInvoiceDetails ON dbo.SupplierInvoice.SupplierInvoiceID = dbo.SupplierInvoiceDetails.SupplierInvoiceID INNER JOIN
             dbo.Product ON dbo.SupplierInvoiceDetails.ProductID = dbo.Product.ProductID
WHERE (dbo.SupplierInvoice.Trans_Year = 2025) AND (dbo.Product.MainGroupID = 38)
ORDER BY dbo.SupplierInvoice.InvoiceDate, dbo.Product.Code



-- sales per year 


  مبيعات الفروع
SELECT dbo.CustomerOrder.Trans_Year, SUM(dbo.CustomerOrderDetails.Quantity) AS [Quantity 1], dbo.CustomerOrderDetails.UnitPrice, dbo.Product.RetailPrice, dbo.Product.MainGroupID, dbo.Product.Code, dbo.Product.Description, dbo.Product.CostPrice, dbo.CustomerOrder.GalleryID, 
             CASE WHEN InsuranceCompanyId IS NULL THEN 1 ELSE 0 END AS InsuranceCompany
FROM   dbo.CustomerOrder INNER JOIN
             dbo.CustomerOrderDetails ON dbo.CustomerOrder.CustomerOrderID = dbo.CustomerOrderDetails.CustomerOrderID INNER JOIN
             dbo.Product ON dbo.CustomerOrderDetails.ProductID = dbo.Product.ProductID
GROUP BY dbo.CustomerOrder.Trans_Year, dbo.CustomerOrderDetails.UnitPrice, dbo.Product.RetailPrice, dbo.Product.MainGroupID, dbo.Product.Code, dbo.Product.Description, dbo.Product.CostPrice, dbo.CustomerOrder.GalleryID, CASE WHEN InsuranceCompanyId IS NULL 
             THEN 1 ELSE 0 END
HAVING (dbo.CustomerOrder.Trans_Year = 2025) AND (dbo.Product.MainGroupID = 38)


--  produact in comiung total
SELECT        Code, Description, MainGroup, MainGroupID, SUM(Incoming) AS Incoming, SUM(Outgoing) AS Outgoing, SUM(Incoming - Outgoing) AS balnce
FROM            dbo.v_ItemCardtaha
GROUP BY Code, Description, MainGroup, MainGroupID
HAVING        (MainGroupID = N'38')


--  produact in comiung wit month and year and branches 

SELECT        SUM(Incoming - Outgoing) AS Incoming, Code, Description, MainGroup, MainGroupID, YEAR(OrderDate) AS year, MONTH(OrderDate) AS month, DepName, TransactionName
FROM            dbo.v_ItemCardtaha
GROUP BY Code, Description, MainGroup, MainGroupID, YEAR(OrderDate), MONTH(OrderDate), DepName, TransactionName
HAVING        (MainGroupID = N'38') AND (YEAR(OrderDate) IN (2024, 2025)) AND (MONTH(OrderDate) IN (1))