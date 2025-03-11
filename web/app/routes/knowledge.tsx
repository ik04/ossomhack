import { useEffect, useState } from "react";
import { Sidebar } from "~/components/sidebar";
import axios from "axios";

interface KnowledgeData {
  userid: number;
  location: string;
  occupation: string;
  age: number;
  income: number;
  expense: number;
  savings: number;
}

interface InvestmentTip {
  tip: string;
  confidence: number;
  category: string;
}

interface Tip {
  recommendation: string;
  risk: string;
}

const parseInvestmentTips = (tips: string): Tip[] => {
  return tips
    .split(/\d️⃣/)
    .slice(1)
    .map((tip) => {
      const [recommendation, riskPart] = tip.split("–");
      const risk = riskPart ? riskPart.match(/\((.*?)\)/)?.[1] || "" : "";
      return {
        recommendation: recommendation.trim(),
        risk: risk,
      };
    });
};

export default function Knowledge() {
  const [knowledgeData, setKnowledgeData] = useState<KnowledgeData | null>(
    null
  );
  const [investmentTips, setInvestmentTips] = useState<InvestmentTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [tips, setTips] = useState<Tip[]>([]);
  const [tipsLoading, setTipsLoading] = useState(true);

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      setTipsLoading(true);
      // First fetch from Laravel backend
      const response = await axios.get("http://localhost:8000/api/knowledge", {
        withCredentials: true,
      });

      if (response.data.status) {
        const payload = response.data.data;
        setKnowledgeData(payload);

        // Then fetch from ML server
        setLoading(false);
        const randId = Math.floor(Math.random() * 1000);
        const onboardResponse = await axios.post(
          "http://localhost:8080/onboarding",
          {
            ...payload,
            userid: randId,
          }
        );

        const tipsResponse = await axios.post(
          "http://localhost:8080/investmenttips",
          {
            user_id: randId,
          }
        );
        setTips(
          parseInvestmentTips(tipsResponse.data.investment_recommendations)
        );
        setTipsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch knowledge:", error);
      setLoading(false);
      setTipsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  return (
    <div className="h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-[120px] border-b border-primary font-sentient font-medium text-[69px] px-5 flex items-end">
          <span>Knowledge</span>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            {/* Profile Summary */}
            {!loading && knowledgeData && (
              <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-sentient text-primary mb-4">
                  Profile Overview
                </h3>
                {knowledgeData && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="text-lg font-medium">
                          {knowledgeData.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Occupation</p>
                        <p className="text-lg font-medium">
                          {knowledgeData.occupation}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="text-lg font-medium">
                          {knowledgeData.age} years
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Savings</p>
                        <p className="text-lg font-medium">
                          ₹{knowledgeData.savings.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Investment Tips */}
            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-sentient text-primary mb-4">
                Investment Tips
              </h3>
              {tipsLoading ? (
                <div className="flex items-center justify-center h-[200px] font-sentient text-2xl text-primary animate-pulse">
                  Loading....
                </div>
              ) : (
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-lg border border-primary"
                    >
                      <p className="font-medium">{tip.recommendation}</p>
                      <div className="mt-2">
                        <span className={`text-sm text-gray-600`}>
                          Risk Level: {tip.risk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="col-span-2 bg-background border-2 border-primary rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-sentient text-primary mb-4">
                Financial Summary
              </h3>
              {knowledgeData && (
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 bg-white rounded-lg border border-primary">
                    <p className="text-sm text-gray-600">Monthly Income</p>
                    <p className="text-2xl font-medium">
                      ₹{knowledgeData.income.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-primary">
                    <p className="text-sm text-gray-600">Monthly Expenses</p>
                    <p className="text-2xl font-medium">
                      ₹{knowledgeData.expense.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-primary">
                    <p className="text-sm text-gray-600">Monthly Savings</p>
                    <p className="text-2xl font-medium">
                      ₹{knowledgeData.savings.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
