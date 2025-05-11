
import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Coffee, 
  ShoppingBag,
  Utensils,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
  {
    id: 1,
    date: "May 10, 2025",
    title: "Morning Coffee Ritual",
    amount: -4.50,
    category: "Food & Drinks",
    narrative: "Your daily espresso from Café Luna represents a small but meaningful financial choice. While the €4.50 spent today seems minimal, this routine adds up to approximately €1,642 annually – equivalent to a weekend getaway or a significant contribution to your emergency fund.",
    icon: Coffee,
    type: "expense"
  },
  {
    id: 2,
    date: "May 9, 2025",
    title: "Salary Deposit",
    amount: 3200.00,
    category: "Income",
    narrative: "Your monthly income arrived right on schedule, providing financial stability. After accounting for your automated savings and investment allocations, you have a discretionary budget of €980 for the next two weeks. Staying within this limit will keep you aligned with your goal of a down payment on an apartment by December.",
    icon: TrendingUp,
    type: "income"
  },
  {
    id: 3,
    date: "May 8, 2025",
    title: "Grocery Shopping",
    amount: -87.35,
    category: "Shopping",
    narrative: "Your weekly grocery expenditure is slightly below your €100 budget, showing good financial discipline. By planning meals and choosing seasonal products, you've optimized your spending while maintaining nutritional quality. This approach saves you approximately €520 annually compared to unplanned grocery shopping.",
    icon: ShoppingBag,
    type: "expense"
  },
  {
    id: 4,
    date: "May 7, 2025",
    title: "ETF Investment",
    amount: -500.00,
    category: "Investment",
    narrative: "Your monthly €500 investment into a global ETF continues to build your long-term wealth. If maintained for 10 years with an average 7% annual return, this habit alone could grow to approximately €83,000. This represents a significant step toward your retirement goal and financial independence journey.",
    icon: TrendingUp,
    type: "investment"
  },
  {
    id: 5,
    date: "May 6, 2025",
    title: "Restaurant Dinner",
    amount: -65.80,
    category: "Food & Drinks",
    narrative: "Your dinner at Milano Trattoria was a planned social expense within your monthly entertainment budget. By limiting such outings to twice monthly while choosing restaurants with good value, you balance enjoyment with financial responsibility. This approach keeps you aligned with your larger financial goals while still maintaining quality of life.",
    icon: Utensils,
    type: "expense"
  },
  {
    id: 6,
    date: "May 5, 2025",
    title: "Savings Transfer",
    amount: -300.00,
    category: "Savings",
    narrative: "Your automatic transfer to your emergency fund brings the total to €7,200 – approximately 3.6 months of essential expenses. You're making steady progress toward your 6-month emergency fund goal. This financial buffer significantly reduces your vulnerability to unexpected life events and gives you greater peace of mind.",
    icon: PiggyBank,
    type: "saving"
  }
];

export default function FinancialNarrative() {
  const [selectedTransaction, setSelectedTransaction] = useState(transactions[0]);
  const [filter, setFilter] = useState("all");

  const filteredTransactions = filter === "all" 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "expense": return "text-red-500";
      case "income": return "text-green-500";
      case "investment": return "text-blue-500";
      case "saving": return "text-purple-500";
      default: return "text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "expense": return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "income": return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "investment": return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "saving": return <PiggyBank className="h-5 w-5 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#000000]">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 text-[#2751B9]" />
            <h1 className="text-3xl font-semibold text-white">Financial Narrative</h1>
          </div>
          <p className="text-[#8E9196] mb-6">Your financial transactions transformed into meaningful stories</p>
          
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-5">
              <Card className="bg-[#151515] border-[#333945] text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Transaction Stories</CardTitle>
                  <CardDescription className="text-[#8E9196]">
                    Select a transaction to see its financial narrative
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="mb-4">
                    <TabsList className="bg-[#000000] border border-[#333945]">
                      <TabsTrigger value="all" className="data-[state=active]:bg-[#2751B9]">All</TabsTrigger>
                      <TabsTrigger value="expense" className="data-[state=active]:bg-[#2751B9]">Expenses</TabsTrigger>
                      <TabsTrigger value="income" className="data-[state=active]:bg-[#2751B9]">Income</TabsTrigger>
                      <TabsTrigger value="investment" className="data-[state=active]:bg-[#2751B9]">Investments</TabsTrigger>
                      <TabsTrigger value="saving" className="data-[state=active]:bg-[#2751B9]">Savings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                      <TransactionList 
                        transactions={filteredTransactions} 
                        selectedId={selectedTransaction.id}
                        onSelect={setSelectedTransaction}
                        getTypeIcon={getTypeIcon}
                        getTypeColor={getTypeColor}
                      />
                    </TabsContent>
                    <TabsContent value="expense">
                      <TransactionList 
                        transactions={transactions.filter(t => t.type === 'expense')} 
                        selectedId={selectedTransaction.id}
                        onSelect={setSelectedTransaction}
                        getTypeIcon={getTypeIcon}
                        getTypeColor={getTypeColor}
                      />
                    </TabsContent>
                    <TabsContent value="income">
                      <TransactionList 
                        transactions={transactions.filter(t => t.type === 'income')} 
                        selectedId={selectedTransaction.id}
                        onSelect={setSelectedTransaction}
                        getTypeIcon={getTypeIcon}
                        getTypeColor={getTypeColor}
                      />
                    </TabsContent>
                    <TabsContent value="investment">
                      <TransactionList 
                        transactions={transactions.filter(t => t.type === 'investment')} 
                        selectedId={selectedTransaction.id}
                        onSelect={setSelectedTransaction}
                        getTypeIcon={getTypeIcon}
                        getTypeColor={getTypeColor}
                      />
                    </TabsContent>
                    <TabsContent value="saving">
                      <TransactionList 
                        transactions={transactions.filter(t => t.type === 'saving')} 
                        selectedId={selectedTransaction.id}
                        onSelect={setSelectedTransaction}
                        getTypeIcon={getTypeIcon}
                        getTypeColor={getTypeColor}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-12 lg:col-span-7">
              <Card className="bg-[#151515] border-[#333945] text-white h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <selectedTransaction.icon className="h-5 w-5" />
                        {selectedTransaction.title}
                      </CardTitle>
                      <CardDescription className="text-[#8E9196]">
                        {selectedTransaction.date} · {selectedTransaction.category}
                      </CardDescription>
                    </div>
                    <div className={`text-xl font-semibold ${getTypeColor(selectedTransaction.type)}`}>
                      {selectedTransaction.amount > 0 ? '+' : ''}€{Math.abs(selectedTransaction.amount).toFixed(2)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none prose-p:text-[#E8E8E8] prose-headings:text-white">
                  <div className="p-6 bg-[#1c1c1c] rounded-lg border border-[#333945]">
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#2751B9]" />
                      Financial Story
                    </h3>
                    <p className="leading-relaxed text-[#E8E8E8]">{selectedTransaction.narrative}</p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white mb-3">Financial Impact</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1c1c1c] rounded-lg border border-[#333945]">
                        <div className="text-sm text-[#8E9196]">Monthly Total</div>
                        <div className="text-lg font-semibold">
                          {selectedTransaction.type === "expense" ? 
                            `-€${(Math.abs(selectedTransaction.amount) * 4.3).toFixed(2)}` : 
                            `€${(Math.abs(selectedTransaction.amount) * 1).toFixed(2)}`
                          }
                        </div>
                      </div>
                      <div className="p-4 bg-[#1c1c1c] rounded-lg border border-[#333945]">
                        <div className="text-sm text-[#8E9196]">Annual Projection</div>
                        <div className="text-lg font-semibold">
                          {selectedTransaction.type === "expense" ? 
                            `-€${(Math.abs(selectedTransaction.amount) * 52).toFixed(2)}` : 
                            `€${(Math.abs(selectedTransaction.amount) * 12).toFixed(2)}`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {selectedTransaction.type === "expense" ? (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-4 w-4 rounded-full bg-[#2751B9] flex-shrink-0"></div>
                            <span>Consider if this expense aligns with your financial priorities and long-term goals</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-4 w-4 rounded-full bg-[#2751B9] flex-shrink-0"></div>
                            <span>Look for opportunities to reduce frequency or find more cost-effective alternatives</span>
                          </li>
                        </>
                      ) : selectedTransaction.type === "income" ? (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-4 w-4 rounded-full bg-[#2751B9] flex-shrink-0"></div>
                            <span>Consider automatic allocations to savings and investments</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-4 w-4 rounded-full bg-[#2751B9] flex-shrink-0"></div>
                            <span>Review your income sources and explore opportunities to diversify</span>
                          </li>
                        </>
                      ) : selectedTransaction.type === "investment" ? (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-4 w-4 rounded-full bg-[#2751B9] flex-shrink-0"></div>
                            <span>Regular investments like this help build wealth through compound growth</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-4 w-4 rounded-full bg-[#2751B9] flex-shrink-0"></div>
                            <span>Consider increasing your monthly contribution by 5% each year</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-4 w-4 rounded-full bg-[#2751B9] flex-shrink-0"></div>
                            <span>Your emergency fund is growing steadily, aiming for 6 months of expenses</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-4 w-4 rounded-full bg-[#2751B9] flex-shrink-0"></div>
                            <span>Once you reach your target, consider redirecting to investments</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#333945] flex justify-between">
                  <Button variant="outline" className="border-[#333945] text-white hover:bg-[#1c1c1c]">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Similar Transactions
                  </Button>
                  <Button className="bg-[#2751B9] hover:bg-[#3962c8]">
                    Set Financial Goal
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TransactionList Component
function TransactionList({ 
  transactions, 
  selectedId, 
  onSelect, 
  getTypeIcon, 
  getTypeColor 
}: { 
  transactions: any[],
  selectedId: number,
  onSelect: (transaction: any) => void,
  getTypeIcon: (type: string) => React.ReactNode,
  getTypeColor: (type: string) => string
}) {
  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
      {transactions.map((transaction) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            variant="outline"
            className={`w-full justify-between p-4 border-[#333945] hover:bg-[#1c1c1c] ${
              selectedId === transaction.id ? "bg-[#1c1c1c] border-[#2751B9]" : ""
            }`}
            onClick={() => onSelect(transaction)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#0c0c0c] p-2 rounded-full">
                <transaction.icon className="h-5 w-5 text-[#2751B9]" />
              </div>
              <div className="text-left">
                <div className="font-medium">{transaction.title}</div>
                <div className="text-sm text-[#8E9196]">{transaction.date}</div>
              </div>
            </div>
            <div className={`${getTypeColor(transaction.type)}`}>
              {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
            </div>
          </Button>
        </motion.div>
      ))}
      
      {transactions.length === 0 && (
        <div className="p-6 text-center text-[#8E9196]">
          No transactions found
        </div>
      )}
    </div>
  );
}
