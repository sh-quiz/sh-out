"use client";

export default function Footer() {
    return (
        <footer className="bg-[#0B0E12] border-t border-[#E8E9EA]/10 pt-24 pb-12 px-4">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-4xl font-black text-[#E8E9EA] mb-6 tracking-tighter">SHARKS</h2>
                    <p className="text-[#E8E9EA]/40 max-w-md">
                        The ultimate cinematic quiz experience for marine enthusiasts and thrill-seekers.
                    </p>
                </div>

                <div>
                    <h3 className="text-[#E8E9EA] font-bold mb-6 uppercase tracking-wider">Explore</h3>
                    <ul className="space-y-4 text-[#E8E9EA]/60">
                        <li className="hover:text-[#FF2D55] cursor-pointer transition-colors">Species</li>
                        <li className="hover:text-[#FF2D55] cursor-pointer transition-colors">Leaderboard</li>
                        <li className="hover:text-[#FF2D55] cursor-pointer transition-colors">About</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-[#E8E9EA] font-bold mb-6 uppercase tracking-wider">Legal</h3>
                    <ul className="space-y-4 text-[#E8E9EA]/60">
                        <li className="hover:text-[#FF2D55] cursor-pointer transition-colors">Privacy Policy</li>
                        <li className="hover:text-[#FF2D55] cursor-pointer transition-colors">Terms of Service</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#E8E9EA]/5 text-[#E8E9EA]/20 text-sm">
                <p>© 2025 SHARKS. All rights reserved.</p>
                <p>Designed for the brave.</p>
            </div>
        </footer>
    );
}
