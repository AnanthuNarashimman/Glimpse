import '../ComponentStyles/LandUpdate.css';
import { Bell } from 'lucide-react';

function LandUpdates() {
  return (
    <section className="updates">
      <div className="updates-container">
        <div className="updates-icon">
          <Bell size={32} strokeWidth={1.5} />
        </div>
        <h2 className="updates-title" id='updates'>Updates</h2>
        <p className="updates-text">
          Currently under development and will post new updates here.
        </p>
      </div>
    </section>
  )
}

export default LandUpdates
