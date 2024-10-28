import { config } from "dotenv";
import Brand from "../models/Brands.js";
import Shopify from 'shopify-api-node'
import moment from "moment";
import axios from "axios";

config();

const getAccestoken = (brandId) => {
    switch (brandId) {
      case '671b68bed3c4f462d681ef45':
        return process.env.SHOPIFY_ACCESS_TOKEN_UDDSTUDIO;
      case '671b6925d3c4f462d681ef47':
        return process.env.SHOPIFY_ACCESS_TOKEN_FISHERMANHUB;
      case '671b7d85f99634509a5f2693':
        return process.env.SHOPIFY_ACCESS_TOKEN_REPRISE;
      case '671b90c83aee55a69981a0c9':
        return process.env.SHOPIFY_ACCESS_TOKEN_KOLORTHERAPI;
      case '671cd209fc16e7d6a19da1fd':
        return process.env.SHOPIFY_ACCESS_TOKEN_KASHMIRVILLA;
      case '671cc01d00989c5fdf2dcb11':
        return process.env.SHOPIFY_ACCESS_TOKEN_MAYINCLOTHING;
      case '671ccd765d652cf6efc21eda':
        return process.env.SHOPIFY_ACCESS_TOKEN_HOUSEOFAWADH;
      case '671cceb19b58dac9e4e23280':
        return process.env.SHOPIFY_ACCESS_TOKEN_FIBERWORLD;
      default:
        throw new Error('Invalid brand ID: No credentials path found');
    }
  };
  
  
export const fetchTotalSales = async (brandId) => {
    try {
      console.log('Fetching orders...');
  
      const brand = await Brand.findById(brandId);
      if (!brand) {
        throw new Error('Brand not found.');
      }
  
      const access_token = getAccestoken(brandId);
      if (!access_token) {
        throw new Error('Access token is missing or invalid.');
      }
  
      const shopify = new Shopify({
        shopName: brand.shopifyAccount?.shopName,
        accessToken: access_token,
      });
  
      // Set start and end date to yesterday
      const now = new Date();
      const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
      const queryParams = {
        status: 'any',
        created_at_min: startOfYesterday.toISOString(),
        created_at_max: endOfYesterday.toISOString(),
        limit: 250, // Fetch 250 orders per request
      };
  
      let hasNextPage = true;
      let pageInfo;
      let orders = [];
  
      while (hasNextPage) {
        if (pageInfo) {
          queryParams.page_info = pageInfo;
        } else {
          delete queryParams.page_info;
        }
  
        try {
          const response = await shopify.order.list(queryParams);
          if (!response || response.length === 0) {
            break; // Exit the loop if no orders are found
          }
  
          orders = orders.concat(response);
          pageInfo = response.nextPageParameters?.page_info || null;
          hasNextPage = !!pageInfo; // Continue fetching if there are more pages
        } catch (error) {
          console.error('Error while fetching orders:', error);
          throw new Error(`Error fetching orders: ${error.message}`);
        }
      }
  
      console.log(`Successfully fetched a total of ${orders.length} orders`);
  
      // Calculate total sales
      const totalSales = orders.reduce((sum, order) => {
        const gross = parseFloat(order.total_price) || 0; // Base gross sales
        const discounts = parseFloat(order.total_discounts) || 0;
        // const shipping = parseFloat(order.total_shipping_price_set?.shop_money?.amount) || 0;
        // const taxes = parseFloat(order.total_tax) || 0;
    
    
        //   const totalDuties = order.line_items.reduce((lineSum, item) => {
        //     return lineSum + item.duties.reduce((dutySum, duty) => {
        //       return dutySum + parseFloat(duty.amount_set.shop_money.amount || 0);
        //     }, 0);
        //   }, 0);
        console.log(discounts)
  
        return sum + gross ; // Adjust total sales by discounts and other fees
      }, 0);
  
      return totalSales; // Return only the total sales
    } catch (error) {
      console.error('Error in fetchTotalSales:', error);
      throw new Error(`Failed to fetch total sales: ${error.message}`);
    }
  };
  
  export const fetchFBAdReport = async (brandId) => {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    try {
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return {
                success: false,
                message: 'Brand not found.',
            };
        }

        const adAccountIds = brand.fbAdAccounts;
        if (!adAccountIds || adAccountIds.length === 0) {
            return {
                success: false,
                message: 'No Facebook Ads accounts found for this brand.',
            };
        }

        // Set start and end date to yesterday
        const startDate = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD');
        const endDate = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD');

        console.log('startDate: ' + startDate, 'endDate: ' + endDate);

        // Prepare batch requests
        const batchRequests = adAccountIds.map((accountId) => ({
            method: 'GET',
            relative_url: `${accountId}/insights?fields=spend,purchase_roas&time_range={'since':'${startDate}','until':'${endDate}'}`,
        }));

        // Make the API call
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/`,
            { batch: batchRequests },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    access_token: accessToken,
                },
            }
        );

        const results = response.data.map((res, index) => {
            const accountId = adAccountIds[index];
        
            if (res.code === 200) {
                const result = JSON.parse(res.body);
                if (result.data && result.data.length > 0) {
                    const insight = result.data[0]; // Get the first entry of insights
                    const formattedResult = {
                        adAccountId: accountId,
                        spend: insight.spend || '0',
                        purchase_roas: (insight.purchase_roas && insight.purchase_roas.length > 0) 
                            ? insight.purchase_roas.map(roas => ({
                                action_type: roas.action_type || 'N/A', // Fallback for missing data
                                value: roas.value || '0', // Fallback for missing data
                            })) 
                            : [], // Return an empty array if no ROAS data
                    };
 
                    return formattedResult;
                }
            }
        
            // If no data or error occurred, return a message for that account
            return {
                adAccountId: accountId,
                message: `Ad Account ${accountId} has no data for the given date.`,
            };
        });
        
    
        // Return structured results without additional JSON parsing
        const finalResponse = {
            success: true,
            data: results
        };


        return finalResponse;
    
    } catch (error) {
        console.error('Error fetching Facebook Ad Account data:', error);
        return {
            success: false,
            message: 'An error occurred while fetching Facebook Ad Account data.',
            error: error.message,
        };
    }
};


// export const addReportData= async (req, res) => {
//     const { brandId } = req.params;

//     try {
//         const fbDataResult = await fetchFBAdReport(brandId);
        
//         if (!fbDataResult.success) {
//             return res.status(400).json({
//                 success: false,
//                 message: fbDataResult.message,
//             });
//         }

//         const fbData = fbDataResult.data;

       

//         fbData.forEach(account => {
//             totalSpend += account.spend || 0;
//             totalRevenue += account.purchase_roas ? account.purchase_roas.reduce((acc, roas) => acc + roas.value, 0) : 0;
//         });

//         const metaROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;

//         // For shopifySales, you need to define how to fetch or calculate it.
//         // Assuming you have a separate function to get Shopify sales data, you can call it here:
//         const shopifySales = await fetchShopifySales(brandId); // You need to implement this function

//         // Prepare the metrics data
//         const metricsData = {
//             brandId,
//             date: moment().subtract(1, 'days').toDate(), // Use yesterday's date
//             metaSpend: totalSpend,
//             metaROAS,
//             googleSpend: 0, // If you need to fetch this, do it similarly
//             googleROAS: 0, // Similarly, if needed
//             totalSpend,
//             grossROI: 0, // Calculate if needed
//             shopifySales,
//             netROI: 0, // Calculate if needed
//         };

//         // Store metrics in the database
//         const metricsEntry = new Metrics(metricsData);
//         await metricsEntry.save();

//         return res.status(201).json({
//             success: true,
//             message: 'Metrics saved successfully.',
//             data: metricsEntry,
//         });

//     } catch (error) {
//         console.error('Error calculating and saving metrics:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'An error occurred while calculating and saving metrics.',
//             error: error.message,
//         });
//     }
// };


  