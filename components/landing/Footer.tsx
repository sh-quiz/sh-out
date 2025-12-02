import { Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-sharks-navy border-t border-sharks-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-sharks-red rounded-lg flex items-center justify-center text-xl">🦈</div>
                            <span className="text-2xl font-bold text-sharks-white">The Sharks</span>
                        </div>
                        <p className="text-sharks-rose/60 max-w-sm">
                            The ultimate competitive quiz platform. Challenge friends, climb the ranks, and prove your knowledge to the world.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-sharks-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-sharks-rose/60">
                            <li><a href="#" className="hover:text-sharks-blue transition-colors">Play Now</a></li>
                            <li><a href="#" className="hover:text-sharks-blue transition-colors">Leaderboard</a></li>
                            <li><a href="#" className="hover:text-sharks-blue transition-colors">Tournaments</a></li>
                            <li><a href="#" className="hover:text-sharks-blue transition-colors">Shop</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sharks-white mb-6">Support</h4>
                        <ul className="space-y-4 text-sharks-rose/60">
                            <li><a href="#" className="hover:text-sharks-blue transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-sharks-blue transition-colors">Community Rules</a></li>
                            <li><a href="#" className="hover:text-sharks-blue transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-sharks-blue transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-sharks-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sharks-rose/40 text-sm">
                        © 2024 The Sharks. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <a href="#" className="text-sharks-rose/60 hover:text-sharks-white transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-sharks-rose/60 hover:text-sharks-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-sharks-rose/60 hover:text-sharks-white transition-colors"><Github className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
