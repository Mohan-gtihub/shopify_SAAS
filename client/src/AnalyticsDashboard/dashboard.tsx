"use client"
import { useState, useEffect, useCallback } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon, Settings2Icon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import axios from "axios"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import AdAccountMetrics from "./AdAccountsMetrics.tsx"
import { AdAccountData } from '@/Dashboard/interfaces.ts'

export default function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(), // Sets the default from date to today
  to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false);
  const [adAccountsMetrics, setAdAccountsMetrics] = useState<AdAccountData[]>([]);


  const navigate = useNavigate();

  const fetchFbAdData = useCallback(async () => {
    setIsLoading(true);
    try {
      const baseURL =
        import.meta.env.PROD
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_LOCAL_API_URL;

      const startDate = date?.from ? format(date.from, "yyyy-MM-dd") : "";
      const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : "";

      const fbAdResponse = await axios.post(
        `${baseURL}/metrics/fbad`,
        { startDate, endDate },
        { withCredentials: true }
      );

      const Fbdata = fbAdResponse.data;
      const transformedData = Fbdata
        .filter((account: any) => !account.message) // Exclude accounts with messages
        .map((account: any) => ({ // Adjust if there's an ID or name in your account
          metrics: [
            { label: 'Amount Spent', value: `₹ ${parseFloat(account.spend).toLocaleString()}` },
            { label: 'Revenue', value: `₹ ${parseFloat(account.Revenue?.value || '0').toLocaleString()}` }, // Handle Revenue safely
            {
              label: 'ROAS (Ads only)',
              value: account.purchase_roas.length > 0
                ? parseFloat(account.purchase_roas[0]?.value).toFixed(2) // Only access if the array has elements
                : '0' // Default to '0' if no ROAS data
            },
            { label: 'Ads Purchases', value: account.purchases?.value || '0' },
            { label: 'CPC (All clicks)', value: `₹ ${parseFloat(account.cpc).toLocaleString()}` },
            { label: 'CPM', value: `₹ ${parseFloat(account.cpm).toFixed(2).toLocaleString()}` },
            { label: 'CTR', value: `${parseFloat(account.ctr).toFixed(2)} %` || '0' },
            { label: 'Cost per Purchase (All)', value: `₹ ${parseFloat(account.cpp).toLocaleString()}` },
          ],
        }));

      console.log('Transformed Metrics:', transformedData);
      setAdAccountsMetrics(transformedData);
    } catch (error) {
      console.error('Error fetching fb ad data:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, date]);


  useEffect(() => {
    fetchFbAdData();
  }, [fetchFbAdData]);

  useEffect(() => {
    console.log('Ad Accounts Metrics:', adAccountsMetrics);
  }, [adAccountsMetrics]); // Log updated state



  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6 lg:px-8">
        <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Settings2Icon className="h-6 w-6 text-gray-500" />
            <h1 className="text-2xl font-bold">Metrics Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Blended summary */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Settings2Icon className="h-5 w-5" />
              <span>Blended summary</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <svg viewBox="0 0 24 24" className="w-5 h-5" >
                <path d="M13.5437 4.24116L13.5441 4.24138C13.904 4.43971 14.2179 4.70303 14.4689 5.01529C14.7198 5.3275 14.903 5.68264 15.009 6.0601L15.4904 5.92486L15.009 6.0601C15.115 6.43752 15.1422 6.83078 15.0891 7.21776C15.0361 7.60457 14.9038 7.97861 14.6989 8.31855C14.6988 8.31873 14.6987 8.31891 14.6986 8.3191L8.41444 18.701C7.9918 19.3741 7.30557 19.868 6.49825 20.0687C5.68937 20.2699 4.83087 20.1586 4.10949 19.7614C3.38872 19.3646 2.86649 18.7168 2.64727 17.9633C2.42868 17.212 2.5264 16.4083 2.92214 15.7226L9.20689 5.33823C9.20695 5.33813 9.20702 5.33802 9.20708 5.33792C9.62451 4.65082 10.3142 4.14383 11.1301 3.93599C11.9464 3.72804 12.8151 3.83872 13.5437 4.24116Z" fill="#FFB70A" stroke="#FFB70A"></path><path d="M21.5404 15.4544L15.24 5.04127C14.7453 4.25097 13.9459 3.67817 13.0138 3.44633C12.0817 3.21448 11.0917 3.34215 10.2572 3.80182C9.4226 4.26149 8.8103 5.01636 8.55224 5.90372C8.29418 6.79108 8.41102 7.73988 8.87757 8.54562L15.178 18.9587C15.6726 19.749 16.4721 20.3218 17.4042 20.5537C18.3362 20.7855 19.3262 20.6579 20.1608 20.1982C20.9953 19.7385 21.6076 18.9836 21.8657 18.0963C22.1238 17.2089 22.0069 16.2601 21.5404 15.4544Z" fill="#3B8AD8"></path><path d="M9.23018 16.2447C9.07335 15.6884 8.77505 15.1775 8.36166 14.7572C7.94827 14.3369 7.43255 14.0202 6.86011 13.835C6.28768 13.6499 5.67618 13.6021 5.07973 13.6958C4.48328 13.7895 3.92026 14.0219 3.44049 14.3723C2.96071 14.7227 2.57898 15.1804 2.32906 15.7049C2.07914 16.2294 1.96873 16.8045 2.00762 17.3794C2.0465 17.9542 2.23347 18.5111 2.55199 19.0007C2.8705 19.4902 3.31074 19.8975 3.83376 20.1863C4.46363 20.5354 5.1882 20.6983 5.91542 20.6542C6.64264 20.6101 7.33969 20.361 7.91802 19.9386C8.49636 19.5162 8.92988 18.9395 9.16351 18.2817C9.39715 17.624 9.42035 16.915 9.23018 16.2447Z" fill="#2CAA14"></path>
              </svg>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderMetricCard("Amount Spent", "₹ 1,818",)}
              {renderMetricCard("Revenue", "₹ 8,965",)}
              {renderMetricCard("ROAS (Ads only)", "4.93",)}
              {renderMetricCard("Ads Purchases", "3",)}
            </div>
          </section>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <span>Loading...</span> {/* You can replace this with a spinner */}
          </div>
        ) : (
          <>
            {adAccountsMetrics.map((accountMetrics, index) => (
              <AdAccountMetrics
                key={index}
                title={`Facebook - Udd Studio Ad Account-${index + 1}`}
                metrics={accountMetrics.metrics || []} // Provide a default empty arra
              />
            ))}
          </>
        )}

      </main>
    </div>
  )
}

function DatePickerWithRange({
  date,
  setDate
}: {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}) {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function renderMetricCard(title: string, value: string) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-start gap-4 pb-2">
        <div className="flex flex-row items-center gap-2">
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M13.5437 4.24116L13.5441 4.24138C13.904 4.43971 14.2179 4.70303 14.4689 5.01529C14.7198 5.3275 14.903 5.68264 15.009 6.0601L15.4904 5.92486L15.009 6.0601C15.115 6.43752 15.1422 6.83078 15.0891 7.21776C15.0361 7.60457 14.9038 7.97861 14.6989 8.31855C14.6988 8.31873 14.6987 8.31891 14.6986 8.3191L8.41444 18.701C7.9918 19.3741 7.30557 19.868 6.49825 20.0687C5.68937 20.2699 4.83087 20.1586 4.10949 19.7614C3.38872 19.3646 2.86649 18.7168 2.64727 17.9633C2.42868 17.212 2.5264 16.4083 2.92214 15.7226L9.20689 5.33823C9.20695 5.33813 9.20702 5.33802 9.20708 5.33792C9.62451 4.65082 10.3142 4.14383 11.1301 3.93599C11.9464 3.72804 12.8151 3.83872 13.5437 4.24116Z" fill="#FFB70A" stroke="#FFB70A"></path>
            <path d="M21.5404 15.4544L15.24 5.04127C14.7453 4.25097 13.9459 3.67817 13.0138 3.44633C12.0817 3.21448 11.0917 3.34215 10.2572 3.80182C9.4226 4.26149 8.8103 5.01636 8.55224 5.90372C8.29418 6.79108 8.41102 7.73988 8.87757 8.54562L15.178 18.9587C15.6726 19.749 16.4721 20.3218 17.4042 20.5537C18.3362 20.7855 19.3262 20.6579 20.1608 20.1982C20.9953 19.7385 21.6076 18.9836 21.8657 18.0963C22.1238 17.2089 22.0069 16.2601 21.5404 15.4544Z" fill="#3B8AD8"></path>
            <path d="M9.23018 16.2447C9.07335 15.6884 8.77505 15.1775 8.36166 14.7572C7.94827 14.3369 7.43255 14.0202 6.86011 13.835C6.28768 13.6499 5.67618 13.6021 5.07973 13.6958C4.48328 13.7895 3.92026 14.0219 3.44049 14.3723C2.96071 14.7227 2.57898 15.1804 2.32906 15.7049C2.07914 16.2294 1.96873 16.8045 2.00762 17.3794C2.0465 17.9542 2.23347 18.5111 2.55199 19.0007C2.8705 19.4902 3.31074 19.8975 3.83376 20.1863C4.46363 20.5354 5.1882 20.6983 5.91542 20.6542C6.64264 20.6101 7.33969 20.361 7.91802 19.9386C8.49636 19.5162 8.92988 18.9395 9.16351 18.2817C9.39715 17.624 9.42035 16.915 9.23018 16.2447Z" fill="#2CAA14"></path>
          </svg>
          <div className="text-lg font-semibold">{title}</div>
        </div>

      </CardHeader>
      <CardContent className="flex flex-row justify-between items-center mt-5">
        <div className="text-4xl font-bold">{value}</div>

      </CardContent>
    </Card>
  )
}






