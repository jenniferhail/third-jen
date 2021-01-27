// React
import React, { useState, useEffect, useRef } from "react";
// CSS
import "./app.scss";
// Data
import { data } from "./data";
// Animations
import { gsap } from "gsap";

function App() {
  const [items, setItems] = useState(data);
  const [index, setIndex] = useState(0);
  // disabling the slider buttons at start and end
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  let x = 0;
  // let sliderRef = [];
  let slider = useRef(null);
  // let slidesRef = [];
  let slides = useRef(null);

  useEffect(() => {
    const lastIndex = items.length - 1;
    // Disable prev btn at last slide
    if (index === 0) {
      setPrevDisabled(true);
      setNextDisabled(false);
    }
    // Enable both btns if slide isn't first or last
    if (index > 0) {
      setPrevDisabled(false);
      setNextDisabled(false);
    }
    // Disable next btn at last slide
    if (index === lastIndex) {
      setPrevDisabled(false);
      setNextDisabled(true);
    }
  }, [index, items]);

  // Counter animation
  const moveDots = () => {
    console.log("moveDots");
  };

  // Slide movement
  const moveSlides = (dir) => {
    setIndex(index + dir);
    x = (index + dir) * 100 * -1;

    gsap.to(slider, {
      xPercent: x,
      duration: 0.6,
    });

    moveDots();
  };

  return (
    <main className="app">
      <div className="slider">
        <div className="slide-wrapper" ref={(el) => (slider = el)}>
          {items.map((item, itemIndex) => {
            const { id, src, alt } = item;
            let position = "";
            if (itemIndex === index) {
              position = " active";
            }
            if (itemIndex < index) {
              position = " visited";
            }
            return (
              <div
                key={id}
                className={`slide${position}`}
                ref={(el) => (slides = el)}
              >
                <img src={src} alt={alt} />
              </div>
            );
          })}
        </div>
        <div className="counters">
          {items.map((item, itemIndex) => {
            let position = "";
            if (itemIndex === index) {
              position = " active";
            }
            if (itemIndex < index) {
              position = " visited";
            }
            return <div key={item.id} className={`counter${position}`}></div>;
          })}
        </div>
        <div className="controls">
          <button
            type="button"
            className="prev btn"
            disabled={prevDisabled}
            onClick={() => moveSlides(-1)}
          >
            <img src="./arrow.svg" alt="View previous slide" />
          </button>
          <button
            type="button"
            className="next btn"
            disabled={nextDisabled}
            onClick={() => moveSlides(1)}
          >
            <img src="./arrow.svg" alt="View next slide" />
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
