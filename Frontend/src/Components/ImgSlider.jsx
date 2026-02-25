import React from 'react'
import Marquee from 'react-fast-marquee';
import img1 from '../assets/adarsh-logo.webp'
import img2 from '../assets/a.webp'
import img3 from '../assets/b.webp'
import img4 from '../assets/c.webp'
import img5 from '../assets/e.webp'
import img6 from '../assets/d.webp'

export default function ImgSlider() {
  return (
    <div>
       <Marquee pauseOnHover={true} speed={50} gradient={false}>
        <img src={img1} alt="logo1" style={{ height: 80, marginRight: 40 }} />
        <img src={img2} alt="logo2" style={{ height: 80, marginRight: 40 }} />
        <img src={img3} alt="logo3" style={{ height: 80, marginRight: 40 }} />
        <img src={img4} alt="logo4" style={{ height: 80, marginRight: 40 }} />
        <img src={img5} alt="logo4" style={{ height: 80, marginRight: 40 }} />
        <img src={img6} alt="logo4" style={{ height: 80, marginRight: 40 }} />
      </Marquee>
    </div>
  )
}
