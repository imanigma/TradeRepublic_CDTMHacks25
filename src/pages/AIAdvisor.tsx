
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Brain, RefreshCw, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const advisors = [
  {
    id: "buffett",
    name: "Warren Buffett",
    description: "Value investing pioneer and CEO of Berkshire Hathaway",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit.jpg",
    style: "Focuses on intrinsic value, long-term growth, and companies with strong economic moats"
  },
  {
    id: "lynch",
    name: "Peter Lynch",
    description: "Legendary Fidelity fund manager and author",
    avatar: "https://www.investopedia.com/thmb/OLYgBJXo1VMKYuSXEHCUyI9vAlA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-542419354-5c47229d46e0fb00010d7e85.jpg",
    style: "Believes in investing in what you know and understand through everyday experiences"
  },
  {
    id: "graham",
    name: "Benjamin Graham",
    description: "Father of value investing and Warren Buffett's mentor",
    avatar: "https://upload.wikimedia.org/wikipedia/en/2/2d/Benjamin_Graham_%281894-1976%29.jpg",
    style: "Emphasizes margin of safety and analyzes stocks based on their intrinsic value"
  }
];

const insights = [
  {
    advisor: "buffett",
    content: "Look for companies with strong economic moats that protect them from competition. In today's market, tech firms with network effects like certain fintech platforms show promise, but be wary of excessive valuations."
  },
  {
    advisor: "lynch",
    content: "The best stock to buy may be one you already know. Consider the financial services you personally use and trust. If you find yourself repeatedly using a particular fintech app, that's a good sign it has customer loyalty."
  },
  {
    advisor: "graham",
    content: "Many tech stocks today trade at prices far beyond their intrinsic value. Apply a margin of safety by looking at fintech companies with proven revenue models, not just growth projections. Remember that price is what you pay; value is what you get."
  }
];

export default function AIAdvisor() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(advisors[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    { role: 'system', content: insights[0].content }
  ]);

  const handleAdvisorChange = (value: string) => {
    const advisor = advisors.find(a => a.id === value) || advisors[0];
    setSelectedAdvisor(advisor);
    const advisorInsight = insights.find(i => i.advisor === value) || insights[0];
    setMessages([{ role: 'system', content: advisorInsight.content }]);
  };

  const handleGenerateInsight = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const advisorInsight = insights.find(i => i.advisor === selectedAdvisor.id) || insights[0];
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Based on recent market developments, I'd recommend focusing on financial services companies with strong digital transformation initiatives. These companies are likely to benefit from the ongoing shift to digital banking and mobile payments." 
      }]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleAskQuestion = () => {
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: "What do you think about investing in fintech startups?" 
    }]);
    
    setIsGenerating(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Fintech startups can offer tremendous growth potential but come with significant risks. I'd recommend allocating only a small portion of your portfolio to these speculative investments. Look for startups that solve real problems, have a clear path to profitability, and operate in regulatory-friendly environments. Consider fintech ETFs as a way to gain exposure while diversifying your risk." 
      }]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#000000]">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-6 w-6 text-[#2751B9]" />
            <h1 className="text-3xl font-semibold text-white">AI Investment Strategist</h1>
          </div>
          <p className="text-[#8E9196] mb-6">Get personalized investment insights from AI clones of legendary investors</p>
          
          <div className="grid grid-cols-3 gap-6 mb-8 max-md:grid-cols-1">
            <Card className="bg-[#151515] border-[#333945] text-white col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">Choose Your Advisor</CardTitle>
                <CardDescription className="text-[#8E9196]">Select an investment legend to guide you</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleAdvisorChange} defaultValue={selectedAdvisor.id}>
                  <SelectTrigger className="bg-[#000000] border-[#333945] text-white">
                    <SelectValue placeholder="Select an advisor" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151515] border-[#333945] text-white">
                    {advisors.map(advisor => (
                      <SelectItem key={advisor.id} value={advisor.id}>{advisor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card className="bg-[#151515] border-[#333945] text-white col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedAdvisor.name}</CardTitle>
                  <CardDescription className="text-[#8E9196]">{selectedAdvisor.description}</CardDescription>
                </div>
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[#2751B9]">
                  <img 
                    src={selectedAdvisor.avatar} 
                    alt={selectedAdvisor.name}
                    className="h-full w-full object-cover" 
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[#8E9196] mb-4">
                  <strong className="text-white">Investment Style:</strong> {selectedAdvisor.style}
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleGenerateInsight} 
                    disabled={isGenerating}
                    className="bg-[#2751B9] hover:bg-[#3962c8]"
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Generate Daily Insight
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleAskQuestion}
                    className="border-[#333945] text-white hover:bg-[#1c1c1c]"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-[#151515] border-[#333945] text-white">
            <CardHeader>
              <CardTitle className="text-xl">Investment Insights</CardTitle>
              <CardDescription className="text-[#8E9196]">
                Personalized advice based on {selectedAdvisor.name}'s investment philosophy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-[#2751B9]/20 border border-[#2751B9]/30 ml-12' 
                        : 'bg-[#1c1c1c] border border-[#333945]'
                    }`}
                  >
                    {message.role !== 'system' && (
                      <div className="flex items-center mb-2">
                        {message.role === 'assistant' ? (
                          <div className="h-8 w-8 rounded-full overflow-hidden border border-[#2751B9] mr-2">
                            <img 
                              src={selectedAdvisor.avatar} 
                              alt={selectedAdvisor.name}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-[#2751B9] flex items-center justify-center text-white mr-2">
                            You
                          </div>
                        )}
                        <div className="text-sm font-medium">
                          {message.role === 'assistant' ? selectedAdvisor.name : 'You'}
                        </div>
                      </div>
                    )}
                    <p className="text-[#E8E8E8]">{message.content}</p>
                  </motion.div>
                ))}
                
                {isGenerating && (
                  <div className="p-4 rounded-lg bg-[#1c1c1c] border border-[#333945]">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden border border-[#2751B9]">
                        <img 
                          src={selectedAdvisor.avatar} 
                          alt={selectedAdvisor.name}
                          className="h-full w-full object-cover opacity-50" 
                        />
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="h-2 w-2 bg-[#2751B9] rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-[#2751B9] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="h-2 w-2 bg-[#2751B9] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#333945] text-[#8E9196] text-sm">
              AI-generated insights based on historical investment philosophies. Not financial advice.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
