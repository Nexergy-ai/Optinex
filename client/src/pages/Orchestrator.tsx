import { useSearchParams } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Zap, Target, Lightbulb } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/Footer";

export default function Orchestrator() {
  const [, navigate] = useLocation();
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get("challengeId");
  const [parsedId, setParsedId] = useState<number | null>(null);

  useEffect(() => {
    if (challengeId) {
      setParsedId(parseInt(challengeId, 10));
    }
  }, [challengeId]);

  const { data: result, isLoading, error } = trpc.orchestrator.getResult.useQuery(
    { challengeId: parsedId! },
    { enabled: !!parsedId }
  );

  if (!parsedId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 mb-4">No challenge ID provided</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-slate-300">Processing your operational challenge...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load results</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Orchestration Results</h1>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Challenge
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* Classification Card */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur overflow-hidden">
            <CardHeader className="border-b border-slate-700 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-cyan-400" />
                <div>
                  <CardTitle className="text-white">Problem Classification</CardTitle>
                  <CardDescription className="text-slate-400">
                    AI-identified problem type and context
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-200 text-lg leading-relaxed">
                {result.classification}
              </p>
            </CardContent>
          </Card>

          {/* Activated Business Units */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur overflow-hidden">
            <CardHeader className="border-b border-slate-700 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-400" />
                <div>
                  <CardTitle className="text-white">Activated Business Units</CardTitle>
                  <CardDescription className="text-slate-400">
                    Departments and teams engaged in the solution
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {result.activatedUnits.map((unit: string, index: number) => (
                  <div
                    key={index}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-center hover:border-cyan-500 transition-colors"
                  >
                    <p className="text-slate-200 font-semibold text-sm">{unit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategic Recommendations */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur overflow-hidden">
            <CardHeader className="border-b border-slate-700 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <div>
                  <CardTitle className="text-white">Strategic Recommendations</CardTitle>
                  <CardDescription className="text-slate-400">
                    AI-generated actionable insights and next steps
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {result.recommendations.map(
                  (rec: { title: string; description: string }, index: number) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-cyan-500 transition-colors"
                    >
                      <h4 className="text-cyan-400 font-semibold mb-2">{rec.title}</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 font-semibold"
            >
              Submit Another Challenge
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
