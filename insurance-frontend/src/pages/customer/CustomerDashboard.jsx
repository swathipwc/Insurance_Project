import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerDashboardStats } from '../../services/dashboardService';
import { Card, CardContent } from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileText, CheckCircle2, ClipboardList, Clock, XCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0
  });
  const [monthlyClaimsData, setMonthlyClaimsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getCustomerDashboardStats();
        setStats({
          totalPolicies: data.totalPolicies || 0,
          activePolicies: data.activePolicies || 0,
          totalClaims: data.totalClaims || 0,
          pendingClaims: data.pendingClaims || 0,
          approvedClaims: data.approvedClaims || 0,
          rejectedClaims: data.rejectedClaims || 0
        });
        
        // Set monthly claims data for charts
        if (data.monthlyClaimsData) {
          setMonthlyClaimsData(data.monthlyClaimsData);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Claims by status for pie chart
  const claimsByStatus = [
    { name: 'Approved', value: stats.approvedClaims, color: '#10b981' },
    { name: 'Pending', value: stats.pendingClaims, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejectedClaims, color: '#ef4444' }
  ].filter(item => item.value > 0); // Only show statuses with claims

  const statCards = [
    {
      title: 'Total Policies',
      value: stats.totalPolicies,
      icon: FileText,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Policies',
      value: stats.activePolicies,
      icon: CheckCircle2,
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
      title: 'Pending Claims',
      value: stats.pendingClaims,
      icon: Clock,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
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
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Welcome back, {user?.username}</p>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          {stats.totalClaims > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Claims Trend Chart */}
              <Card className="border border-gray-200 shadow-md">
                <CardContent className="pt-6 pb-5 px-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">My Claims Trend</h2>
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
                        name="Submitted"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="approved" 
                        stackId="1"
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                        name="Approved"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="rejected" 
                        stackId="1"
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.3}
                        name="Rejected"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Claims Status Distribution */}
              {claimsByStatus.length > 0 && (
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
              )}

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
                      <Bar dataKey="submitted" fill="#6366f1" radius={[4, 4, 0, 0]} name="Submitted" />
                      <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved" />
                      <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerDashboard;

