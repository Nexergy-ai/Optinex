import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";

const INDUSTRIES = [
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Finance",
  "Technology",
  "Logistics",
  "Energy",
  "Telecommunications",
  "Education",
  "Government",
  "Automotive",
  "Aerospace",
  "Pharmaceuticals",
  "Food & Beverage",
  "Real Estate",
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export default function ChallengeForm() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [industry, setIndustry] = useState("Manufacturing");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  const submitChallenge = trpc.orchestrator.submitChallenge.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
      setAttachmentUrl(file.name);
    }
  };

  const handleRemoveFile = () => {
    setAttachmentFile(null);
    setAttachmentUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please describe your operational challenge");
      return;
    }

    if (!isAuthenticated) {
      toast.info("You need to log in to submit a challenge");
      return;
    }

    try {
      try {
        const result = await submitChallenge.mutateAsync({
          industry,
          priority: priority as "Low" | "Medium" | "High" | "Critical",
          description,
          attachmentUrl: attachmentUrl || undefined,
        });

        toast.success("Challenge submitted successfully!");
        
        // Navigate to orchestrator page with challenge ID
        navigate(`/orchestrator?challengeId=${result.challengeId}`);
      } catch (mutationError) {
        console.error("Mutation error:", mutationError);
        throw mutationError;
      }
    } catch (error) {
      console.error("Error submitting challenge:", error);
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        toast.error("Please log in to submit a challenge");
      } else {
        toast.error("Failed to submit challenge. Please try again.");
      }
    }
  };

  return (
    <section id="challenge-form" className="bg-slate-900 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white">Describe Your Challenge</CardTitle>
            <CardDescription className="text-slate-400">
              Upload context and OPTINEX AI will orchestrate intelligence across all business units.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Industry Selector */}
              <div className="space-y-3">
                <Label htmlFor="industry" className="text-slate-200 font-semibold">
                  Industry
                </Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger
                    id="industry"
                    className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600 focus:ring-cyan-500"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-600 bg-slate-700">
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind} className="text-white hover:bg-slate-600">
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Selector */}
              <div className="space-y-3">
                <Label htmlFor="priority" className="text-slate-200 font-semibold">
                  Priority
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger
                    id="priority"
                    className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600 focus:ring-cyan-500"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-600 bg-slate-700">
                    {PRIORITIES.map((pri) => (
                      <SelectItem key={pri} value={pri} className="text-white hover:bg-slate-600">
                        {pri}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description Textarea */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description" className="text-slate-200 font-semibold">
                    Operational Challenge
                  </Label>
                  <span className="text-sm text-slate-400">
                    {description.length} characters
                  </span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe your operational challenge, business problem, or process inefficiency. Be specific about what is the problem, current metrics, what you've tried, and constraints."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 border-slate-600 bg-slate-700 text-white placeholder:text-slate-500 focus:ring-cyan-500 resize-none"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label className="text-slate-200 font-semibold">
                  Attach Files (Optional)
                </Label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 hover:border-cyan-500 transition-colors">
                  {attachmentFile ? (
                    <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
                      <span className="text-slate-200 text-sm truncate">{attachmentFile.name}</span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-slate-300 text-sm font-medium">Click to upload</span>
                      <span className="text-slate-500 text-xs mt-1">or drag and drop</span>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.png,.jpg,.jpeg"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitChallenge.isPending || !description.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitChallenge.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Orchestrate Intelligence"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
