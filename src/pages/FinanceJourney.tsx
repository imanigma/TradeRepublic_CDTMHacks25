
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Calendar, 
  Clock, 
  Coffee, 
  ShoppingBag, 
  Bus, 
  Building2, 
  MonitorSmartphone,
  Utensils,
  PiggyBank,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";

const timelineData = [
  { time: "08:15 AM", event: "Morning Coffee", amount: -4.50, icon: Coffee, category: "Food & Drinks" },
  { time: "08:45 AM", event: "Public Transport", amount: -2.80, icon: Bus, category: "Transportation" },
  { time: "09:00 AM", event: "Arrived at Work", amount: 0, icon: Building2, category: "Work" },
  { time: "12:30 PM", event: "Lunch Break", amount: -12.35, icon: Utensils, category: "Food & Drinks" },
  { time: "15:00 PM", event: "Monthly Salary", amount: 3200.00, icon: DollarSign, category: "Income" },
  { time: "17:30 PM", event: "Grocery Shopping", amount: -58.90, icon: ShoppingBag, category: "Shopping" },
  { time: "18:15 PM", event: "Digital Subscription", amount: -14.99, icon: MonitorSmartphone, category: "Entertainment" },
  { time: "20:00 PM", event: "Savings Transfer", amount: -300.00, icon: PiggyBank, category: "Savings" }
];

const spendingData = [
  { name: "Food & Drinks", value: 480, color: "#2751B9" },
  { name: "Housing", value: 1200, color: "#3962C8" },
  { name: "Transportation", value: 250, color: "#5169C8" },
  { name: "Entertainment", value: 200, color: "#7C84D0" },
  { name: "Shopping", value: 350, color: "#8E9DD6" },
  { name: "Savings", value: 500, color: "#A0B9E2" },
  { name: "Others", value: 220, color: "#C6D7EF" }
];

const accountBalanceData = [
  { date: "Apr 10", balance: 2850 },
  { date: "Apr 11", balance: 2800 },
  { date: "Apr 12", balance: 2780 },
  { date: "Apr 13", balance: 2700 },
  { date: "Apr 14", balance: 2650 },
  { date: "Apr 15", balance: 2600 },
  { date: "Apr 16", balance: 2700 },
  { date: "Apr 17", balance: 2750 },
  { date: "Apr 18", balance: 2800 },
  { date: "Apr 19", balance: 2700 },
  { date: "Apr 20", balance: 2650 },
  { date: "May 1", balance: 3100 }, // Salary
  { date: "May 2", balance: 3050 },
  { date: "May 3", balance: 3000 },
  { date: "May 4", balance: 2950 },
  { date: "May 5", balance: 2900 },
  { date: "May 6", balance: 2850 },
  { date: "May 7", balance: 2750 },
  { date: "May 8", balance: 2650 },
  { date: "May 9", balance: 5850 }, // Salary
  { date: "May 10", balance: 5800 }
];

const financialGoalData = [
  {
    name: "Emergency Fund",
    current: 7200,
    target: 12000,
    percentage: 60,
    color: "#2751B9"
  },
  {
    name: "Down Payment",
    current: 15000,
    target: 50000,
    percentage: 30,
    color: "#3962C8" 
  },
  {
    name: "Vacation Fund",
    current: 2500,
    target: 3000,
    percentage: 83,
    color: "#5169C8"
  }
];

export default function FinanceJourney() {
  const [selectedDate, setSelectedDate] = useState("May 10, 2025");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen bg-[#000000]">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-6 w-6 text-[#2751B9]" />
            <h1 className="text-3xl font-semibold text-white">Finance Journey</h1>
          </div>
          <p className="text-[#8E9196] mb-6">A visual walkthrough of your daily financial activities</p>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-[#333945] text-white hover:bg-[#1c1c1c]">
                Previous Day
              </Button>
              <div className="text-xl font-medium text-white">{selectedDate}</div>
              <Button variant="outline" className="border-[#333945] text-white hover:bg-[#1c1c1c]">
                Next Day
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-[#2751B9] hover:bg-[#3962c8]">
                Today
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Daily Timeline */}
            <div className="col-span-12 lg:col-span-4">
              <Card className="bg-[#151515] border-[#333945] text-white h-full">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#2751B9]" />
                    Daily Timeline
                  </CardTitle>
                  <CardDescription className="text-[#8E9196]">
                    Financial activities throughout your day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 border-l border-[#333945]">
                    {timelineData.map((event, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`mb-6 relative ${selectedEvent === index ? 'z-10' : ''}`}
                      >
                        <div 
                          className={`absolute left-[-20px] top-0 w-8 h-8 rounded-full bg-[#1c1c1c] border-2 ${
                            selectedEvent === index 
                              ? "border-[#2751B9]" 
                              : "border-[#333945]"
                          } flex items-center justify-center`}
                        >
                          <event.icon className="h-4 w-4 text-[#2751B9]" />
                        </div>
                        <Button 
                          variant="outline"
                          className={`w-full p-4 text-left flex flex-col items-start border-[#333945] hover:bg-[#1c1c1c] ${
                            selectedEvent === index ? "bg-[#1c1c1c] border-[#2751B9]" : ""
                          }`}
                          onClick={() => setSelectedEvent(index === selectedEvent ? null : index)}
                        >
                          <div className="flex justify-between w-full items-center">
                            <span className="text-[#8E9196]">{event.time}</span>
                            {event.amount !== 0 && (
                              <span className={`${event.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {event.amount > 0 ? '+' : ''}€{Math.abs(event.amount).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-lg font-medium">{event.event}</div>
                          {event.category && <div className="text-sm text-[#8E9196] mt-1">{event.category}</div>}
                          
                          {selectedEvent === index && event.amount !== 0 && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3 border-t border-[#333945] w-full"
                            >
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <div className="text-[#8E9196]">Daily Total</div>
                                  <div className="font-medium">
                                    {event.amount > 0 ? '+' : '-'}€{Math.abs(event.amount).toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[#8E9196]">Monthly Total</div>
                                  <div className="font-medium">
                                    {event.amount > 0 ? '+' : '-'}€{(Math.abs(event.amount) * (event.amount > 0 ? 1 : 4.3)).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Financial Overview */}
            <div className="col-span-12 lg:col-span-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Account Balance Chart */}
                <Card className="bg-[#151515] border-[#333945] text-white">
                  <CardHeader>
                    <CardTitle className="text-xl">Account Balance</CardTitle>
                    <CardDescription className="text-[#8E9196]">
                      30-day account balance trend
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={accountBalanceData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333945" />
                          <XAxis dataKey="date" stroke="#8E9196" />
                          <YAxis stroke="#8E9196" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#151515", borderColor: "#333945", color: "#fff" }}
                            formatter={(value) => [`€${value}`, "Balance"]}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="balance" 
                            stroke="#2751B9" 
                            fill="url(#colorBalance)" 
                          />
                          <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2751B9" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#2751B9" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Spending Breakdown & Financial Goals */}
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                  <Card className="bg-[#151515] border-[#333945] text-white">
                    <CardHeader>
                      <CardTitle className="text-xl">Monthly Spending</CardTitle>
                      <CardDescription className="text-[#8E9196]">
                        Breakdown by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={spendingData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              fill="#8884d8"
                              paddingAngle={2}
                              dataKey="value"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {spendingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Legend 
                              verticalAlign="bottom" 
                              height={36} 
                              formatter={(value) => <span style={{ color: "#E8E8E8" }}>{value}</span>} 
                            />
                            <Tooltip 
                              formatter={(value) => [`€${value}`, "Amount"]}
                              contentStyle={{ backgroundColor: "#151515", borderColor: "#333945" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#151515] border-[#333945] text-white">
                    <CardHeader>
                      <CardTitle className="text-xl">Financial Goals</CardTitle>
                      <CardDescription className="text-[#8E9196]">
                        Track your progress
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {financialGoalData.map((goal, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{goal.name}</span>
                              <span className="text-[#8E9196]">
                                €{goal.current.toLocaleString()} / €{goal.target.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-2 bg-[#333945] rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full rounded-full"
                                style={{ backgroundColor: goal.color, width: '0%' }}
                                animate={{ width: `${goal.percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                            <div className="text-right text-sm text-[#8E9196]">{goal.percentage}%</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-[#333945]">
                      <Button className="w-full bg-[#2751B9] hover:bg-[#3962c8]">
                        Set New Goal
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
