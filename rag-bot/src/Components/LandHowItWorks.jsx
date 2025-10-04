import '../ComponentStyles/LandHowItWorks.css';
import { Brain, Upload, MessageCircleQuestion } from 'lucide-react';

function LandHowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        <h2 className="section-headline">
          From Chaos to Clarity in 3 Simple Steps
        </h2>
        
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">
              <Brain size={40} strokeWidth={1.5} />
            </div>
            <div className="step-content">
              <h3 className="step-title">Create Your Brain</h3>
              <p className="step-description">
                Give your knowledge base a name. Create separate "Brains" for different projects, topics, or teams to keep your information organized and relevant.
              </p>
            </div>
            <div className="step-number">01</div>
          </div>
          
          <div className="step-card">
            <div className="step-icon">
              <Upload size={40} strokeWidth={1.5} />
            </div>
            <div className="step-content">
              <h3 className="step-title">Upload Anything</h3>
              <p className="step-description">
                Drag and drop your files. We support PDFs, Word documents, screenshots, images, and audio recordings. Our AI processes and understands the content of each file.
              </p>
            </div>
            <div className="step-number">02</div>
          </div>
          
          <div className="step-card">
            <div className="step-icon">
              <MessageCircleQuestion size={40} strokeWidth={1.5} />
            </div>
            <div className="step-content">
              <h3 className="step-title">Ask Everything</h3>
              <p className="step-description">
                Use the simple chat interface to ask questions in plain English. Get a single, comprehensive answer synthesized from all your uploaded files, complete with citations.
              </p>
            </div>
            <div className="step-number">03</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandHowItWorks
