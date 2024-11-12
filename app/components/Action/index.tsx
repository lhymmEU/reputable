import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ShieldCheckIcon } from "lucide-react";

export default function Action() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-12">Reputable</h1>

      <div className="w-full max-w-md space-y-6">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Issue Reputation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                New
              </Badge>
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-80">
                Create and issue new reputation tokens
              </p>
              <p className="font-mono text-lg">REP-1234-5678-9012</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">My Reputation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Active
              </Badge>
              <StarIcon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-80">
                Your current reputation score
              </p>
              <p className="font-mono text-3xl font-bold">4.8 / 5.0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
