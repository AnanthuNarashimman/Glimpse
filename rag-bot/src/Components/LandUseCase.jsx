import '../ComponentStyles/LandUseCase.css';
import { GraduationCap, Briefcase, Scale } from 'lucide-react';

function LandUseCase() {
  return (
    <section className="use-cases">
      <div className="use-cases-container">
        <h2 className="section-headline">
          Built for Researchers, Teams, and Innovators
        </h2>
        
        <div className="use-cases-grid">
          <div className="use-case-card">
            <div className="use-case-icon">
              <GraduationCap size={32} strokeWidth={1.5} />
            </div>
            <h3 className="use-case-title">For Academic Research</h3>
            <p className="use-case-description">
              Upload research papers, lecture recordings, and data images to one brain for a comprehensive literature review.
            </p>
          </div>
          
          <div className="use-case-card">
            <div className="use-case-icon">
              <Briefcase size={32} strokeWidth={1.5} />
            </div>
            <h3 className="use-case-title">For Project Management</h3>
            <p className="use-case-description">
              Keep all project docs, meeting notes, and team updates in a single, searchable brain.
            </p>
          </div>
          
          <div className="use-case-card">
            <div className="use-case-icon">
              <Scale size={32} strokeWidth={1.5} />
            </div>
            <h3 className="use-case-title">For Legal Analysis</h3>
            <p className="use-case-description">
              Quickly find clauses and precedents across thousands of pages of contracts and case files.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandUseCase
