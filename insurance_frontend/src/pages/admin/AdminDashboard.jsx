import React, { useState, useEffect, useRef } from 'react';
import { Users, FileText, ClipboardList, Clock, DollarSign, XCircle, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';
import { getAdminDashboardStats } from '../../services/dashboardService';
import { Card, CardContent } from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalPolicies: 0,
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalCoverageAmount: 0,
    totalClaimAmount: 0,
    totalApprovedAmount: 0
  });
  const [monthlyClaimsData, setMonthlyClaimsData] = useState([]);
  const [policyTypesData, setPolicyTypesData] = useState([]);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React StrictMode
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getAdminDashboardStats();

        setStats({
          totalCustomers: dashboardData.totalCustomers || 0,
          totalPolicies: dashboardData.totalPolicies || 0,
          totalClaims: dashboardData.totalClaims || 0,
          pendingClaims: dashboardData.pendingClaims || 0,
          approvedClaims: dashboardData.approvedClaims || 0,
          rejectedClaims: dashboardData.rejectedClaims || 0,
          totalCoverageAmount: dashboardData.totalCoverageAmount || 0,
          totalClaimAmount: dashboardData.totalClaimAmount || 0,
          totalApprovedAmount: dashboardData.totalApprovedAmount || 0
        });

        // Set chart data
        if (dashboardData.monthlyClaimsData) {
          setMonthlyClaimsData(dashboardData.monthlyClaimsData);
        }
        if (dashboardData.policyTypeDistribution) {
          const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
          setPolicyTypesData(dashboardData.policyTypeDistribution.map((item, index) => ({
            name: item.policyType,
            value: item.count,
            color: colors[index % colors.length]
          })));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      hasFetchedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Claims by status
  const claimsByStatus = [
    { name: 'Approved', value: stats.approvedClaims, color: '#10b981' },
    { name: 'Pending', value: stats.pendingClaims, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejectedClaims, color: '#ef4444' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Total Policies',
      value: stats.totalPolicies,
      icon: FileText,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Coverage',
      value: formatCurrency(stats.totalCoverageAmount),
      icon: DollarSign,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Claims',
      value: stats.totalClaims,
      icon: ClipboardList,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Approved Claims',
      value: stats.approvedClaims,
      icon: CheckCircle2,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Rejected Claims',
      value: stats.rejectedClaims,
      icon: XCircle,
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims,
      icon: Clock,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Claim Amount',
      value: formatCurrency(stats.totalClaimAmount),
      icon: DollarSign,
      iconBgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Comprehensive overview of insurance management</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <CardContent className="px-4 pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${stat.iconBgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium mb-1">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Trend Chart */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="pt-6 pb-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Claims Trend</h2>
                  <p className="text-[10px] text-gray-600 font-medium">Last 6 months</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyClaimsData}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ fontSize: '10px', padding: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="submitted" 
                  stackId="1"
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="approved" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="rejected" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Claims Status Distribution */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="pt-6 pb-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Claims Status</h2>
                  <p className="text-[10px] text-gray-600 font-medium">Distribution by status</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={claimsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ fontSize: '10px', padding: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Claims Bar Chart */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="pt-6 pb-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Monthly Claims</h2>
                  <p className="text-[10px] text-gray-600 font-medium">Submitted, approved, and rejected</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyClaimsData.length > 0 ? monthlyClaimsData : []}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ fontSize: '10px', padding: '8px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                />
                <Bar dataKey="submitted" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Policy Types Distribution */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="pt-6 pb-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Policy Types</h2>
                  <p className="text-[10px] text-gray-600 font-medium">Distribution by type</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={policyTypesData.length > 0 ? policyTypesData : []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {policyTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ fontSize: '10px', padding: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
