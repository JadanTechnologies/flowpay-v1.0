
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-text-primary mt-2">{value}</h3>
        <p className="text-xs text-text-secondary mt-1">{change}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
