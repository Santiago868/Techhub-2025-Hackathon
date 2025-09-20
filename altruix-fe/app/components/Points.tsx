import React from 'react';

interface PointsProps {
  points: number;
  variant?: 'inline' | 'card';
  size?: 'small' | 'medium' | 'large';
}

export default function Points({ points, variant = 'card', size = 'medium' }: PointsProps) {
  const formatPoints = (pts: number) => {
    return pts.toLocaleString();
  };

  if (variant === 'inline') {
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    };

    return (
      <div className="inline-flex items-center gap-2">
        <div className="flex items-center gap-1 ">
          <span className="text-yellow-500">★</span>
          <span className={`font-semibold text-yellow-600 ${sizeClasses[size]}`}>
            {formatPoints(points)} points
          </span>
        </div>
      </div>
    );
  }

  const cardSizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const textSizeClasses = {
    small: { title: 'text-lg', points: 'text-2xl' },
    medium: { title: 'text-xl', points: 'text-3xl' },
    large: { title: 'text-2xl', points: 'text-4xl' }
  };

  return (
    <div className={`bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md border border-yellow-200 ${cardSizeClasses[size]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`font-semibold text-yellow-800 mb-1 ${textSizeClasses[size].title}`}>
            Total Points
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className={`font-bold text-yellow-700 ${textSizeClasses[size].points}`}>
              {formatPoints(points)}
            </span>
          </div>
        </div>
        <div className="text-yellow-400 text-4xl">
          ★
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-yellow-600">
          Keep volunteering to earn more points!
        </p>
      </div>
    </div>
  );
}