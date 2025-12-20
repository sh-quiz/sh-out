'use client';

import { motion } from 'framer-motion';

const LeaderboardRow = ({ rank, user, index }: { rank: number, user: any, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (index * 0.05), duration: 0.5 }}
            className="flex items-center h-[80px] px-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
        >

            <span className={`w-8 text-sm font-medium ${rank <= 10 ? 'text-white' : 'text-[#878D96]'}`}>
                {rank}
            </span>


            <div className="w-12 h-12 rounded-full bg-[#161B22] mx-4 flex-shrink-0" />


            <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate">{user.name}</h4>
                <p className="text-[#878D96] text-xs truncate">{user.school}</p>
            </div>


            <span className="text-white font-bold text-sm tracking-wide">
                {user.score}
            </span>
        </motion.div>
    );
};


export default function LeaderboardList({ users }: { users: any[] }) {
    if (!users || users.length === 0) {
        return (
            <div className="text-center py-12 text-[#878D96]">
                No other players on the leaderboard yet.
            </div>
        );
    }

    return (
        <div className="pb-24">
            {users.map((entry, i) => (
                <LeaderboardRow
                    key={entry.user.id}
                    rank={entry.rank}
                    user={{
                        name: `${entry.user.firstName} ${entry.user.lastName}`,
                        school: entry.user.school || 'Unknown School',
                        score: entry.score.toLocaleString(),
                    }}
                    index={i}
                />
            ))}
        </div>
    );
}
