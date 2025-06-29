import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, AlertCircle, Copy } from "lucide-react";

export default function OAuthSetup() {
  const currentDomain = window.location.origin;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const providers = [
    {
      name: "Google",
      status: "needs-setup",
      consoleUrl: "https://console.cloud.google.com/",
      redirectUri: `${currentDomain}/api/auth/google/callback`,
      envVars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      steps: [
        "Go to Google Cloud Console",
        "Create a new project or select existing",
        "Enable Google+ API",
        "Go to Credentials → Create OAuth 2.0 Client ID",
        "Set authorized redirect URI",
        "Copy Client ID and Client Secret"
      ]
    },
    {
      name: "Apple", 
      status: "needs-setup",
      consoleUrl: "https://developer.apple.com/account/",
      redirectUri: `${currentDomain}/api/auth/apple/callback`,
      envVars: ["APPLE_CLIENT_ID", "APPLE_CLIENT_SECRET"],
      steps: [
        "Go to Apple Developer Console",
        "Create a new Service ID",
        "Configure Sign in with Apple",
        "Set return URL",
        "Generate Client Secret",
        "Copy Client ID and Client Secret"
      ]
    },
    {
      name: "GitHub",
      status: "needs-setup", 
      consoleUrl: "https://github.com/settings/developers",
      redirectUri: `${currentDomain}/api/auth/github/callback`,
      envVars: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
      steps: [
        "Go to GitHub Developer Settings",
        "Click New OAuth App",
        "Set Authorization callback URL",
        "Copy Client ID and Client Secret"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">OAuth Setup Guide</h1>
          <p className="text-lg text-gray-600">
            Set up social login for your INTRN platform
          </p>
        </div>

        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Great News!</h3>
              <p className="text-blue-800">
                Your social login buttons are working perfectly! You just saw the Google login redirect to <code>/api/auth/google</code>. 
                The 404 error is expected because OAuth credentials aren't set up yet.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {providers.map((provider) => (
            <Card key={provider.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{provider.name} OAuth Setup</CardTitle>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Setup Required
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Redirect URI (Copy this exactly)</h4>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 px-3 py-2 bg-gray-100 border rounded text-sm">
                      {provider.redirectUri}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(provider.redirectUri)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Environment Variables Needed</h4>
                  <div className="space-y-1">
                    {provider.envVars.map((envVar) => (
                      <code key={envVar} className="block px-3 py-1 bg-gray-100 border rounded text-sm">
                        {envVar}=your_value_here
                      </code>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Setup Steps</h4>
                  <ol className="space-y-1 text-sm text-gray-600">
                    {provider.steps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Button asChild className="w-full">
                  <a href={provider.consoleUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open {provider.name} Console
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">After Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-green-700">
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 mt-0.5" />
                <span>Add the environment variables to your Replit Secrets</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 mt-0.5" />
                <span>Restart your application</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 mt-0.5" />
                <span>Test social login on the auth page</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}