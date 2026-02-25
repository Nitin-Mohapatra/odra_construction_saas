import React from 'react'
import logo from '../assets/logo.jpg'
// import img1 from '../assets/construn1.png'
// import img2 from '../assets/construn2.png'
// import img3 from '../assets/construn3.png'
// import vd1 from "../assets/vd1.mp4";
import vd4 from "../assets/vd4.mp4";
import vd3 from "../assets/vd3.mp4";

export default function Caroucell() {
    return (
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-interval="false">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>

            <div className="carousel-inner" style={{height:"75vh"}}>
                <div className="carousel-item active" style={{height:"75vh"}}>
                    <video
                        src={vd4}
                        className="d-block w-100 object-fit-fill"
                        alt="Slide 1"
                        style={{height:"75vh"}}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
                <div className="carousel-item " style={{height:"75vh"}}>
                    <video
                        src={vd3}
                        className="d-block w-100 object-fit-fill"
                        alt="Slide 2"
                        style={{height:"75vh"}}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
                <div className="carousel-item" style={{height:"75vh"}}>
                    <video
                        src={vd3}
                        className="d-block w-100 object-fit-fill"
                        alt="Slide 3"
                        style={{height:"75vh"}}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon " aria-hidden="true" style={{ filter: "invert(1)" }}></span>
                <span className="visually-hidden ">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" style={{filter:"invert(1)"}}></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}
