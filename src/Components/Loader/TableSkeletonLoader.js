// SkeletonLoader.js
import React from 'react';
import './PageLoader.css'; // Import the CSS for the skeleton loader

const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-header"></div>
      <div className="skeleton-filters">
        <div className="skeleton-filter"></div>
        <div className="skeleton-filter"></div>
        <div className="skeleton-filter"></div>
        <div className="skeleton-filter"></div>
      </div>
      <div className="skeleton-table">
        <div className="skeleton-table-header">
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
          <div className="skeleton-table-cell"></div>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <div className="skeleton-table-row" key={index}>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
            <div className="skeleton-table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
