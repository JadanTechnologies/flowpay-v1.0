import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-border rounded ${className}`} />
  );
};

export default Skeleton;
