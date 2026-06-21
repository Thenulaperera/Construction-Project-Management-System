import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Filter, FileText } from 'lucide-react';

const Reports = () => {
  const [activeReportType, setActiveReportType] = useState('progress');
  const [dateRange, setDateRange] = useState('last-30-days');

  const reportTypes = [
    { id: 'progress', label: 'Progress Reports', icon: TrendingUp },
    { id: 'cost', label: 'Cost Reports', icon: BarChart3 },
    { id: 'safety', label: 'Safety Reports', icon: FileText },
  ];

  const progressReports = [
    { id: 1, title: 'Q1 2024 Progress Summary', project: 'Downtown Office Complex', date: '2024-03-31', completion: 75, status: 'On Track' },
    { id: 2, title: 'February Progress Report', project: 'Residential Tower A', date: '2024-02-29', completion: 45, status: 'Delayed' },
    { id: 3, title: 'Phase 2 Completion Report', project: 'Shopping Center Phase 2', date: '2024-01-15', completion: 90, status: 'Completed' },
  ];

  const costReports = [
    { id: 1, title: 'Material Cost Analysis Q1', totalCost: 450000, budgetVariance: -5.2, date: '2024-03-31' },
    { id: 2, title: 'Labor Cost Report February', totalCost: 320000, budgetVariance: +8.7, date: '2024-02-29' },
    { id: 3, title: 'Equipment Rental Costs', totalCost: 125000, budgetVariance: -2.1, date: '2024-01-31' },
  ];

  const safetyReports = [
    { id: 1, title: 'Monthly Safety Inspection', incidents: 2, severity: 'Minor', date: '2024-03-31', status: 'Resolved' },
    { id: 2, title: 'Site Safety Audit Report', incidents: 0, severity: 'None', date: '2024-02-28', status: 'Compliant' },
    { id: 3, title: 'Equipment Safety Check', incidents: 1, severity: 'Minor', date: '2024-01-31', status: 'Resolved' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track': case 'Completed': case 'Compliant': case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Delayed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProgressReports = () => (
    <div className="space-y-6">
      {progressReports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Project: {report.project}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Completion</p>
              <div className="flex items-center mt-1">
                <div className="flex-1 mr-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${report.completion}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{report.completion}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Report Date</p>
              <p className="font-medium text-gray-900">{new Date(report.date).toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium text-gray-900">{report.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCostReports = () => (
    <div className="space-y-6">
      {costReports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Generated on {new Date(report.date).toLocaleDateString()}</p>
            </div>
            
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">${report.totalCost.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Budget Variance</p>
              <p className={`text-2xl font-bold ${report.budgetVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {report.budgetVariance > 0 ? '+' : ''}{report.budgetVariance}%
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-medium ${Math.abs(report.budgetVariance) > 5 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(report.budgetVariance) > 5 ? 'Over Budget' : 'Within Budget'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSafetyReports = () => (
    <div className="space-y-6">
      {safetyReports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Report Date: {new Date(report.date).toLocaleDateString()}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Incidents Reported</p>
              <p className={`text-2xl font-bold ${report.incidents === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                {report.incidents}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Severity Level</p>
              <p className="font-medium text-gray-900">{report.severity}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium text-gray-900">{report.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeReportType) {
      case 'progress': return renderProgressReports();
      case 'cost': return renderCostReports();
      case 'safety': return renderSafetyReports();
      default: return renderProgressReports();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and view progress, cost, and safety reports</p>
        </div>
        
        <div className="flex space-x-4">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setActiveReportType(type.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeReportType === type.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {type.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Reports Generated</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Completion</p>
              <p className="text-2xl font-bold text-gray-900">72%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {renderContent()}
    </div>
  );
};

export default Reports;
