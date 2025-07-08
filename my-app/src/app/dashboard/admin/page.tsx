export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard content will go here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600">Manage your store from here.</p>
        </div>
      </div>
    </div>
  )
}
