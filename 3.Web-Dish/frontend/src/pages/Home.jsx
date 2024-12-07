/* eslint-disable no-unused-vars */
import React from 'react'
import Banner from '../components/Banner/Banner'
import NavBarDishes from '../components/NavBarDishes'
import Choices from '../components/Choices/Choices'
import SeasonalTop from '../components/Seasonal-Top/SeasonalTop'
import Footer from '../components/FooterItem/Footer'
import DishComponent from "../components/DishComponent"
import '../components/DishShow.css'
import '../components/results.css'
import { useRef } from 'react'

let i = 0
const Home = (props) => {

  const seasonalTopRef = useRef(null);

  const scrollToSeasonalTop = () => {
    seasonalTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='overflow-x-hidden' >
      {props.showSearch && <div>
          {props.dishes.map((e)=>{
            return(
              <DishComponent key={i++} ingre={e.ingredients} instructions={e.instructions} title={e.dish_name} img={e.image} />
            )
          })}
        </div>}
        {!props.showSearch && <div>
        <NavBarDishes />
        <Banner />
        <Choices scrollToSeasonalTop={scrollToSeasonalTop}/>
        <div ref={seasonalTopRef}><SeasonalTop /></div>
        <Footer />
      </div>}
    </div>
  )
}

export default Home
