import Banner from './Banner/Banner'
import Features from './features/Features'
import Stats from './Stats/Stats'
import Investments from './Investments/Investments'
import FAQ from './FAQ/FAQ'
import './Home.css'

export default function Home() {
  return (
    <>
      <title>Home | Amanah</title>

      <Banner />
      <Features />
      <Stats />
      <Investments />
      <FAQ />
    </>
  )
}