import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Loader from "../../components/common/Loader";
import { adminApi } from "../../services/api/admin.api";
import { formatCurrency } from "../../utils/formatCurrency";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">{title}</h2>
      <div className="h-64">{children}</div>
    </div>
  );
}

/**
 * Feature spec §17 Analytics: search trends, popular locations, avg rent,
 * most-viewed rooms, conversion rate, retention, match success, booking
 * conversion, listing performance — all sourced from GET /analytics/overview.
 */
export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.analytics()
      .then(({ data: res }) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Crunching platform analytics..." />;
  if (!data) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Platform-wide performance and trends</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <StatCard label="Avg. rent" value={formatCurrency(data.averageRent)} />
        <StatCard label="Conversion rate" value={`${data.bookingConversion ?? 0}%`} />
        <StatCard label="User retention" value={`${data.userRetention ?? 0}%`} />
        <StatCard label="Successful matches" value={data.successfulMatches ?? 0} />
        <StatCard label="Booking conversion" value={`${data.bookingConversion ?? 0}%`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Search trends (last 30 days)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.searchTrends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2f7ef0" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Popular locations">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.popularLocations || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="city" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2f7ef0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {data.mostViewedRooms?.length > 0 && (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Most viewed listings</h2>
          <div className="space-y-2">
            {data.mostViewedRooms.map((r) => (
              <div key={r._id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{r.title}</span>
                <span className="font-medium text-gray-900">{r.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
