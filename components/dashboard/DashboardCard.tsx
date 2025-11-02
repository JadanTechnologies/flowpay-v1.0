
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, icon, onClick }) => {
  const content = (
    <>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-text-primary mt-2">{value}</h3>
        <p className="text-xs text-text-secondary mt-1">{change}</p>
      </div>
    </>
  );

  const baseClasses = "bg-surface border border-border rounded-xl p-6 flex flex-col justify-between transition-shadow duration-300";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} text-left w-full hover:border-primary hover:shadow-primary/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`${baseClasses} hover:shadow-primary/20 hover:shadow-lg`}>
      {content}
    </div>
  );
};

export default DashboardCard;
