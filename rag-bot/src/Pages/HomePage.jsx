import '../PageStyles/HomePage.css';
import { Plus, MessageSquare, Brain, Calendar, ImageOff, Import } from 'lucide-react';
import Navbar from '../Components/Navbar';

function HomePage() {
    return (
        <div className="homepage">
            <Navbar />
            <div className="homepage-container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <h1 className="welcome-title">Welcome back, User</h1>
                    <p className="welcome-subtitle">What would you like to work on today?</p>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <div className="action-tile">
                        <div className="action-icon">
                            <Plus size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="action-title">Create a Brain</h3>
                        <p className="action-description">Start a new knowledge base for your project</p>
                    </div>

                    <div className="action-tile">
                        <div className="action-icon">
                            <MessageSquare size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="action-title">Start a Chat</h3>
                        <p className="action-description">Ask questions from your existing brains</p>
                    </div>
                </div>

                {/* Recent Brains */}
                <div className="recent-section">
                    <h2 className="section-title">Recent Brains</h2>

                    <div className="brains-grid">
                        <div className="brain-card">
                            <div className="brain-header">
                                <div className="brain-icon">
                                    <Brain size={24} strokeWidth={1.5} />
                                </div>
                                <div className="brain-info">
                                    <h3 className="brain-name">Research Project 2024</h3>
                                    <div className="brain-meta">
                                        <Calendar size={14} strokeWidth={1.5} />
                                        <span>Updated 2 hours ago</span>
                                    </div>
                                </div>
                            </div>
                            <p className="brain-description">Academic research papers and lecture notes for literature review.</p>
                            <div className="brain-stats">
                                <span className="stat">24 files</span>
                                <span className="stat-divider">•</span>
                                <span className="stat">156 queries</span>
                            </div>
                        </div>

                        <div className="brain-card">
                            <div className="brain-header">
                                <div className="brain-icon">
                                    <Brain size={24} strokeWidth={1.5} />
                                </div>
                                <div className="brain-info">
                                    <h3 className="brain-name">Team Documentation</h3>
                                    <div className="brain-meta">
                                        <Calendar size={14} strokeWidth={1.5} />
                                        <span>Updated yesterday</span>
                                    </div>
                                </div>
                            </div>
                            <p className="brain-description">Project docs, meeting notes, and team updates in one place.</p>
                            <div className="brain-stats">
                                <span className="stat">18 files</span>
                                <span className="stat-divider">•</span>
                                <span className="stat">89 queries</span>
                            </div>
                        </div>

                        <div className="brain-card">
                            <div className="brain-header">
                                <div className="brain-icon">
                                    <Brain size={24} strokeWidth={1.5} />
                                </div>
                                <div className="brain-info">
                                    <h3 className="brain-name">Legal Contracts</h3>
                                    <div className="brain-meta">
                                        <Calendar size={14} strokeWidth={1.5} />
                                        <span>Updated 3 days ago</span>
                                    </div>
                                </div>
                            </div>
                            <p className="brain-description">Contract analysis and precedent research for ongoing cases.</p>
                            <div className="brain-stats">
                                <span className="stat">42 files</span>
                                <span className="stat-divider">•</span>
                                <span className="stat">203 queries</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
