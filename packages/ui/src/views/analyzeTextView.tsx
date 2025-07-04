import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Textarea } from "@repo/ui/components/textarea";
import { Button } from "@repo/ui/components/button";
import { TextAnalysisResult } from "../types/text-analysis.js";
import { useApiConfig } from "../lib/network-config";

function getSentimentText(score: number): string {
  if (score === 0) return "Neutral 😐";
  return score > 0 ? "Positive 🙂" : "Negative ☹️";
}

interface AnalyzeTextViewProps {
  apiBaseUrl?: string;
}

export const AnalyzeTextView = ({ apiBaseUrl }: AnalyzeTextViewProps) => {
  const [sourceText, setSourceText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TextAnalysisResult | null>(null);
  const { apiBaseUrl: detectedUrl, isLocal, networkAddress } = useApiConfig(apiBaseUrl);
  const baseUrl = apiBaseUrl || detectedUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/test-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: sourceText }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.data);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Text Analysis App</h1>
      {!isLocal && networkAddress && (
        <p className="text-sm text-gray-600 mb-2">
          Using API at: {networkAddress}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter your text here..."
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={isLoading}>
          Analyze Text
        </Button>
      </form>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-semibold">Word Count:</dt>
                <dd>{result.analysis.wordCount}</dd>
              </div>
              <div>
                <dt className="font-semibold">Character Count:</dt>
                <dd>{result.analysis.charCount}</dd>
              </div>
              <div>
                <dt className="font-semibold">Most Frequent Word:</dt>
                <dd>{result.analysis.mostFrequentWord}</dd>
              </div>
              <div>
                <dt className="font-semibold">Sentiment Score:</dt>
                <dd>{getSentimentText(result.analysis.sentimentScore)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-semibold">Timestamp:</dt>
                <dd>{new Date(result.timestamp).toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
