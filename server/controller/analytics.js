import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { config } from "dotenv";
import Brand from "../models/Brands.js";
import moment from "moment";

config();


const getCredentials = (brandId) => {
  switch (brandId) {
    case '671b68bed3c4f462d681ef45':
      return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL_UDDSTUDIO,
        private_key: process.env.GOOGLE_PRIVATE_KEY_UDDSTUDIO.replace(/\\n/g, '\n')
      };
    case '671b6925d3c4f462d681ef47':
      return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL_FISHERMANHUB,
        private_key: process.env.GOOGLE_PRIVATE_KEY_FISHERMANHUB.replace(/\\n/g, '\n')
      };
    case '671b90c83aee55a69981a0c9':
      return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL_KOLORTHERAPI,
        private_key: process.env.GOOGLE_PRIVATE_KEY_KOLORTHERAPI.replace(/\\n/g, '\n')
      };
    case '671b7d85f99634509a5f2693':
      return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL_REPRISE,
        private_key: process.env.GOOGLE_PRIVATE_KEY_REPRISE.replace(/\\n/g, '\n')
      };
    case '671cc01d00989c5fdf2dcb11':
      return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL_MAYINCLOTHING,
        private_key: process.env.GOOGLE_PRIVATE_KEY_MAYINCLOTHING.replace(/\\n/g, '\n')
      };
    default:
      console.warn(`No credentials found for brand ID: ${brandId}`);
      return null;
  }
};


// Batch request handler
export async function getBatchReports(req, res) {
  try {
    const { brandId } = req.params;

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found.' });
    }

    const credentials = getCredentials(brandId);

    if (!credentials) {
      console.warn(`No credentials found for brand ID: ${brandId}`);
      return res.status(200).json([]);
    }

    const client = new BetaAnalyticsDataClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });


    const propertyId = brand.ga4Account?.PropertyID;

    // Get the startDate and endDate from the request body
    let { startDate, endDate } = req.body;

    // Check if startDate and endDate are empty strings
    if (!startDate || !endDate) {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Format the dates to YYYY-MM-DD
      startDate = firstDayOfMonth.toISOString().split('T')[0];
      endDate = lastDayOfMonth.toISOString().split('T')[0];
    }

    // Construct the batch request with individual report requests
    const [batchResponse] = await client.batchRunReports({
      property: `properties/${propertyId}`,
      requests: [
        // First report: Landing Page Report (limited monthly data)
        {
          dateRanges: [
            {
              startDate, // Using startDate from req.body
              endDate,   // Using endDate from req.body
            },
          ],
          dimensions: [                // Group by month
            { name: 'landingPage' }    // Landing page path
          ],
          metrics: [
            { name: 'totalUsers' },
            { name: 'sessions' },
            { name: 'addToCarts' },
            { name: 'checkouts' },
            { name: 'conversions' },
          ],
        },
        // Second report: Sessions by Location (monthly data)
        {
          dateRanges: [
            {
              startDate, // Using startDate from req.body
              endDate,   // Using endDate from req.body
            },
          ],
          dimensions: [
            { name: 'city' },                        // City of the user
            { name: 'country' },                     // Country of the user
            { name: 'region' }                       // Region within the country
          ],
          metrics: [
            { name: 'totalUsers' },
            { name: 'sessions' },
          ]
        
        },
        // Third report: Sessions by Referring Channel (monthly data)
        {
          dateRanges: [
            {
              startDate, // Using startDate from req.body
              endDate,   // Using endDate from req.body
            },
          ],
          dimensions: [
            { name: "source" },
            { name: "medium" },                  // Group by month
            { name: 'sessionDefaultChannelGroup' }   // Referring channel
          ],
          metrics: [
            { name: 'totalUsers' },
            { name: 'sessions' }
          ]
        },
        // Fourth report: Returning Customer Rate (monthly data)
        {
          dateRanges: [
            {
              startDate, // Using startDate from req.body
              endDate,   // Using endDate from req.body
            },
          ],
          dimensions: [
            { name: 'yearMonth' },  // Group by month
          ],
          metrics: [
            { name: 'totalUsers' },   // Total users (including both new and returning)
            { name: 'newUsers' },     // New users in the given period
          ],
        },
        {
          dateRanges: [
            { startDate, endDate }
          ],
          dimensions: [
            { name: 'transactionId' },
            { name: 'date' },        // Unique ID for each purchase               // Date of the transaction
          ],
          metrics: [
            { name: 'sessions' }       // Number of items purchased            // Sessions that resulted in purchase
          ],
        },
        //
      ]
    });

    // Format the batch responses
    const batchData = batchResponse.reports.map((report, index) => {
      // Add a unique report type for each report
      switch (index) {
        case 0: // Landing Page Report
          return {
            reportType: 'Landing Page Report',
            data: report.rows.map(row => ({
              landingPage: row.dimensionValues[0]?.value,
              visitors: row.metricValues[0]?.value,
              sessions: row.metricValues[1]?.value,
              addToCarts: row.metricValues[2]?.value,
              checkouts: row.metricValues[3]?.value,
              conversions: row.metricValues[4]?.value,
            }))
          };
        case 1: // Sessions by Location
          return {
            reportType: 'Sessions by Location',
            data: report.rows.map(row => ({
              city: row.dimensionValues[0]?.value,
              country: row.dimensionValues[1]?.value,
              region: row.dimensionValues[2]?.value,
              visitors: row.metricValues[0]?.value,
              sessions: row.metricValues[1]?.value,
            }))
          };
        case 2: // Sessions by Referring Channel
          return {
            reportType: 'Sessions by Referring Channel',
            data: report.rows.map(row => ({
              source: row.dimensionValues[0]?.value,
              medium: row.dimensionValues[1]?.value,  // Medium (e.g., cpc, organic, referral)
              channel: row.dimensionValues[2]?.value,
              visitors: row.metricValues[0]?.value,
              sessions: row.metricValues[1]?.value,
            }))
          };
        case 3: // Returning Customer Rate
          return {
            reportType: 'Returning Customer Rate',
            data: report.rows.map(row => {
              const totalUsers = parseInt(row.metricValues[0].value);
              const newUsers = parseInt(row.metricValues[1].value);
              const returningUsers = totalUsers - newUsers;
              const returnRate = totalUsers > 0 ? (returningUsers / totalUsers) * 100 : 0;

              return {
                yearMonth: row.dimensionValues[0]?.value,
                returnRate: returnRate.toFixed(2)  // Returning customer rate as percentage
              };
            })
          };
        case 4: // Purchase Data
          return {
            reportType: 'Purchase Data',
            data: report.rows.map(row => ({
              transactionId: row.dimensionValues[0]?.value,
              date: row.dimensionValues[1]?.value,  // Date of the transaction
              sessions: row.metricValues[0]?.value,
            }))
          };
        default:
          return [];
      }
    });


    // Send the batch report data
    res.status(200).json(batchData);
  } catch (error) {
    console.error('Error fetching batch reports:', error);
    res.status(500).json({ error: 'Failed to fetch batch reports.' });
  }
}


export async function getDailyAddToCartAndCheckouts(req, res) {
  try {
    const { brandId } = req.params;

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found.' });
    }

    const credentials = getCredentials(brandId);
    if (!credentials) {
      console.warn(`No credentials found for brand ID: ${brandId}`);
      return res.status(200).json([]);
    }

    const client = new BetaAnalyticsDataClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const propertyId = brand.ga4Account?.PropertyID;

    let { startDate, endDate } = req.body;

    const adjustToIST = (date) => {
      // Add 5 hours and 30 minutes (in milliseconds) to convert to IST
      const offset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      return new Date(date.getTime() + offset);
    };
    
    if (!startDate || !endDate) {
      const now = new Date();
    
      // First day of the current month in UTC
      const firstDayOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
      console.log("First day of the month (UTC):", firstDayOfMonth);
    
      // Today's date in UTC
      const currentDayOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      console.log("Current day of the month (UTC):", currentDayOfMonth);
    
      // Adjust the start and end dates to IST
      startDate = adjustToIST(firstDayOfMonth);
      endDate = adjustToIST(currentDayOfMonth);
    } else {
      // If startDate and endDate are provided in the body, adjust them to IST
      startDate = adjustToIST(new Date(startDate));
      endDate = adjustToIST(new Date(endDate));
    }
    
    // Format the dates to YYYY-MM-DD in IST
    const formatToLocalDateString = (date) => {
      return date.toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format
    };
    
    startDate = formatToLocalDateString(startDate);
    endDate = formatToLocalDateString(endDate);
    
    console.log("Adjusted Date Range (IST):", startDate, "to", endDate);
    


    const data = [];


    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }], // Group by date
      metrics: [
        { name: 'addToCarts' },
        { name: 'checkouts' },
        { name: 'sessions' },
        { name: 'ecommercePurchases' }
      ],
      orderBys: [
        {
          desc: false,
          dimension: { dimensionName: 'date' }
        }
      ],
    });

    // Parse the data from the response
    response.rows.forEach(row => {
      const Date = row.dimensionValues[0]?.value;
      const formattedDate = moment(Date).format("DD-MM-YYYY");
      data.push({
        Date:formattedDate,
        AddToCarts: row.metricValues[0]?.value || 0,
        Checkouts: row.metricValues[1]?.value || 0,
        Sessions: row.metricValues[2]?.value || 0,
        Purchases: row.metricValues[3]?.value || 0,
        AddToCartRate: ((row.metricValues[0]?.value/row.metricValues[2]?.value)*100).toFixed(2) || 0,
        PurchaseRate:((row.metricValues[3]?.value/row.metricValues[2]?.value)*100).toFixed(2) || 0
      });
    });

    // Send the data as response
    res.status(200).json({
      reportType: 'Daily Add to Cart, Checkout, and Session Data for Date Range',
      data,
    });
  } catch (error) {
    console.error('Error fetching daily Add to Cart and Checkout data:', error);
    res.status(500).json({ error: 'Failed to fetch daily Add to Cart and Checkout data.' });
  }
}







