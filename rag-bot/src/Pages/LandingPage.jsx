import LandHeader from "../Components/LandHeader";
import LandHero from "../Components/LandHero";
import LandHowItWorks from "../Components/LandHowItWorks";
import LandUseCase from "../Components/LandUseCase";
import LandUpdates from "../Components/LandUpdates";

import '../PageStyles/LandingPage.css';

function LandingPage() {
  return (
    <>
    <LandHeader />
    <LandHero />
    <LandHowItWorks />
    <LandUseCase />
    <LandUpdates />
    </>
  )
}

export default LandingPage
