import React from 'react';

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  image?: string;
}

interface RewardCardProps {
  reward: Reward;
  onClaim?: (reward: Reward) => void;
  claimed?: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  onClaim,
  claimed = false
}) => {
  return (
    <div className={`reward-card ${claimed ? 'claimed' : ''}`}>
      {/* RewardCard implementation */}
      {reward.image && (
        <img src={reward.image} alt={reward.title} className="reward-image" />
      )}
      <div className="reward-content">
        <h3>{reward.title}</h3>
        <p>{reward.description}</p>
        <span className="reward-points">{reward.points} points</span>
        {!claimed && (
          <button onClick={() => onClaim?.(reward)}>
            Claim Reward
          </button>
        )}
      </div>
    </div>
  );
};

export default RewardCard;