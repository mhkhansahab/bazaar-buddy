import { ProductsManager } from "@/components/products-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Next.js Products Manager
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Full-stack product management with Next.js API routes and Supabase
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Products Manager */}
            <div className="lg:col-span-3">
              <ProductsManager />
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🛍️ Products</CardTitle>
                  <CardDescription>
                    Full CRUD operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create products</li>
                    <li>• Read/view products</li>
                    <li>• Update products</li>
                    <li>• Delete products</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔧 Tech Stack</CardTitle>
                  <CardDescription>
                    Modern full-stack setup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Frontend:</span>
                      <span className="text-green-600">Next.js 15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Backend:</span>
                      <span className="text-green-600">API Routes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span className="text-green-600">Supabase</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UI:</span>
                      <span className="text-green-600">shadcn/ui</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎯 Features</CardTitle>
                  <CardDescription>
                    What&apos;s included
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• TypeScript support</li>
                    <li>• Form validation</li>
                    <li>• Error handling</li>
                    <li>• Loading states</li>
                    <li>• Responsive design</li>
                    <li>• Category management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📊 API Endpoints</CardTitle>
                  <CardDescription>
                    Available REST endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-1">
                    <div><code>GET /api/products</code></div>
                    <div><code>POST /api/products</code></div>
                    <div><code>GET /api/products/[id]</code></div>
                    <div><code>PUT /api/products/[id]</code></div>
                    <div><code>DELETE /api/products/[id]</code></div>
                    <div><code>GET /api/categories</code></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
