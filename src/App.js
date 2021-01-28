// React
import React, { useState, useEffect, useRef } from "react";
// CSS
import "./app.scss";
import styled, { css } from "styled-components";
// Data
import { data } from "./data";
// Animations
import { gsap } from "gsap";
// import Button from "./styled";

function App() {
  const [items, setItems] = useState(data);
  const [index, setIndex] = useState(0);
  // disabling the slider buttons at start and end
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  let x = 0;
  let sliderRef = useRef(null);

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

  // Slide movement
  const moveSlides = (dir) => {
    setIndex(index + dir);
    x = (index + dir) * 100 * -1;

    gsap.to(sliderRef, {
      xPercent: x,
      duration: 0.5,
      ease: "power4.out",
    });
  };

  return (
    <main className="app">
      <div className="slider">
        <div className="slide-wrapper" ref={(el) => (sliderRef = el)}>
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
              <div key={id} className={`slide${position}`}>
                <img src={src} alt={alt} />
              </div>
            );
          })}
        </div>
        <Counters>
          {items.map((item, itemIndex) => {
            let position = "";
            if (itemIndex === index) {
              position = "active";
            }
            if (itemIndex < index) {
              position = "visited";
            }
            return <Counter key={item.id} position={position}></Counter>;
          })}
        </Counters>
        <Controls>
          <Button
            type="button"
            prev
            className="btn"
            disabled={prevDisabled}
            onClick={() => moveSlides(-1)}
          >
            <img src="./arrow.svg" alt="View previous slide" />
          </Button>
          <Button
            type="button"
            next
            className="btn"
            disabled={nextDisabled}
            onClick={() => moveSlides(1)}
          >
            <img src="./arrow.svg" alt="View next slide" />
          </Button>
        </Controls>
      </div>
    </main>
  );
}

// Styled Components - Counters
const Counters = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  height: 7rem;
  padding-left: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Counter = styled.div`
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  margin: 0 0.4rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transition: margin 500ms ease;
  ${(props) =>
    props.position === "active" &&
    css`
      margin: 0 2rem 0 0.4rem;
      background-color: rgba(255, 255, 255, 1);
    `}
  ${(props) =>
    props.position === "visited" &&
    css`
      background-color: rgba(255, 255, 255, 1);
    `}
`;

// Styled Components - Buttons
const Button = styled.button`
  margin: 0;
  padding: 0;
  background: rgba(0, 0, 0, 0);
  border: none;
  border-radius: 0;
  cursor: pointer;

  width: 7rem;
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.075);
  opacity: 1;
  transition: background-color 400ms ease;
  &:hover,
  &:focus {
    background-color: #f9f9f9;
    outline: none;
  }
  img {
    width: 1.6rem;
  }
  &:disabled {
    img {
      opacity: 0.5;
    }
  }
  ${(props) =>
    props.prev &&
    css`
      transform: scaleX(-1);
    `}
  ${(props) =>
    props.next &&
    css`
      border-left: none;
    `}
`;
const Controls = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  display: flex;
  flex-wrap: nowrap;
`;

export default App;
