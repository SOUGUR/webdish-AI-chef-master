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

let i = 0
const Home = (props) => {
  return (
    <div className='overflow-x-hidden' >
      <div style={{"display":`${props.showSearch == false?"none":"block"}`}}>
        {props.dishes.map((e)=>{
          console.log(e)
          return(
            <DishComponent key={i++} ingre={e.ingredients} instructions={e.instructions} title={e.dish_name} img={e.image} />
          )
        })}
      </div>
      <div style={{"display":`${props.showSearch == true?"none":"block"}`}}>
        <NavBarDishes />
        <Banner />
        <Choices />
        <SeasonalTop />
        <Footer />
      </div>
    </div>
  )
}

export default Home
