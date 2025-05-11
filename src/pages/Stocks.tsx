
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Search } from "lucide-react";

// Sample stock data
const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 187.68, change: 1.25, changePercent: 0.67 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 334.44, change: -2.54, changePercent: -0.76 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 146.72, change: 4.28, changePercent: 3.01 },
  { symbol: "GOOG", name: "Alphabet Inc.", price: 142.08, change: 1.55, changePercent: 1.10 },
  { symbol: "META", name: "Meta Platforms", price: 329.25, change: -3.15, changePercent: -0.95 }
];

const europeanStocks = [
  { symbol: "SAP.DE", name: "SAP SE", price: 169.22, change: 2.34, changePercent: 1.4 },
  { symbol: "SIE.DE", name: "Siemens AG", price: 155.38, change: -1.74, changePercent: -1.11 },
  { symbol: "ALV.DE", name: "Allianz SE", price: 243.15, change: 3.45, changePercent: 1.44 },
  { symbol: "VOW3.DE", name: "Volkswagen AG", price: 118.90, change: -2.35, changePercent: -1.94 },
  { symbol: "BAS.DE", name: "BASF SE", price: 46.82, change: 0.72, changePercent: 1.56 }
];

const StockCard = ({ stock }: { stock: typeof popularStocks[0] }) => {
  const isPositive = stock.change > 0;
  
  return (
    <Card className="bg-[#151515] border border-[#333945] hover:bg-[#1c1c1c] transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#2751B9]/20 text-white flex items-center justify-center font-bold">
              {stock.symbol.substring(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-white">{stock.symbol}</p>
              <p className="text-sm text-[#8E9196]">{stock.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-white">€{stock.price}</p>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <span className="text-sm">{isPositive ? '+' : ''}{stock.change}</span>
              {isPositive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Stocks() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex min-h-screen bg-[#000000]">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Stocks</h1>
                <p className="text-[#8E9196]">Discover and invest in companies worldwide</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E9196]" size={16} />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  className="bg-[#151515] border border-[#333945] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2751B9]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <Card className="bg-[#151515] border border-[#333945]">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-xl">Market Overview</CardTitle>
                <CardDescription className="text-[#8E9196]">Track major indices and market performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#1D1D1D] p-4 rounded-lg">
                    <p className="text-[#8E9196] text-sm mb-1">S&P 500</p>
                    <p className="text-white font-semibold text-xl">4,783.45</p>
                    <div className="flex items-center text-green-500">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      <span>1.25%</span>
                    </div>
                  </div>
                  <div className="bg-[#1D1D1D] p-4 rounded-lg">
                    <p className="text-[#8E9196] text-sm mb-1">NASDAQ</p>
                    <p className="text-white font-semibold text-xl">15,102.54</p>
                    <div className="flex items-center text-green-500">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      <span>1.73%</span>
                    </div>
                  </div>
                  <div className="bg-[#1D1D1D] p-4 rounded-lg">
                    <p className="text-[#8E9196] text-sm mb-1">DAX</p>
                    <p className="text-white font-semibold text-xl">17,842.85</p>
                    <div className="flex items-center text-red-500">
                      <ArrowDown className="w-4 h-4 mr-1" />
                      <span>0.45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="popular" className="mb-10">
            <TabsList className="bg-[#151515] border border-[#333945]">
              <TabsTrigger value="popular" className="text-white data-[state=active]:bg-[#2751B9]">Popular</TabsTrigger>
              <TabsTrigger value="european" className="text-white data-[state=active]:bg-[#2751B9]">European</TabsTrigger>
              <TabsTrigger value="watchlist" className="text-white data-[state=active]:bg-[#2751B9]">Watchlist</TabsTrigger>
            </TabsList>
            <TabsContent value="popular">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {popularStocks.map(stock => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="european">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {europeanStocks.map(stock => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="watchlist">
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="w-16 h-16 bg-[#2751B9]/20 text-[#2751B9] rounded-full flex items-center justify-center mb-4">
                  <Search size={24} />
                </div>
                <h3 className="text-xl text-white font-medium mb-2">Your watchlist is empty</h3>
                <p className="text-[#8E9196] max-w-md">Search for stocks and add them to your watchlist to track their performance</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
