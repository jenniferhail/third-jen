// React
import React, { useState, useEffect, useRef, createRef } from "react";
// CSS
import "./app.scss";
import styled, { css } from "styled-components";
// Data
import { data } from "./data";
// Animations
import { gsap } from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
gsap.registerPlugin(Draggable, InertiaPlugin);

function App() {
  const [items, setItems] = useState(data);
  const [index, setIndex] = useState(0);
  // Disabling the slider buttons at start and end
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  let x = 0;
  let sliderRef = useRef(null);
  const counterElsRef = useRef(items.map((item) => createRef()));
  const gridWidth = 590;

  useEffect(() => {
    const lastIndex = items.length - 1;

    // Disable prev btn at last slide
    if (index === 0) {
      setPrevDisabled(true);
      setNextDisabled(false);
      // Animate first counter to start
      gsap.to(counterElsRef.current[index], {
        margin: "0 2rem 0 0.4rem",
        backgroundColor: "rgba(255, 255, 255, 1)",
        ease: "power4.out",
        duration: 0.5,
      });
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

  // Make slider draggable
  const createDraggable = () => {
    Draggable.create(
      sliderRef,
      {
        type: "xPercent",
        inertia: true,
        zIndexBoost: false,
        bounds: {
          left: -(gridWidth * (items.length - 1)),
          width: gridWidth * items.length,
        },
        snap: {
          x: function (endValue) {
            let snapPoint = Math.round(endValue / gridWidth) * gridWidth;
            return snapPoint;
          },
        },
        throwProps: true,
        onDragEnd: function () {
          let endX = this.endX;
          let startX = this.startX;
          calibrate(startX, endX);
        },
        allowNativeTouchScrolling: false,
      },
      []
    );
  };

  const calibrate = (startVal, endVal) => {
    let startIndex =
      ((Math.round(startVal / gridWidth) * gridWidth) / 590) * -1;
    let endIndex = ((Math.round(endVal / gridWidth) * gridWidth) / 590) * -1;
    let difference;
    // console.log(startIndex, endIndex);
    setIndex(endIndex);

    if (startVal > endVal) {
      difference = endIndex - startIndex;
      // Next
      if (difference > 1) {
        // which indexes did I pass over
        // console.log("next difference", startIndex, endIndex);
        for (let i = startIndex; i <= endIndex; i++) {
          gsap.to(counterElsRef.current[i], {
            margin: "0 0.4rem",
            backgroundColor: "rgba(255, 255, 255, 1)",
            ease: "power4.out",
            duration: 0.6,
          });
        }
        gsap.to(counterElsRef.current[endIndex], {
          margin: "0 2rem 0 0.4rem",
          backgroundColor: "rgba(255, 255, 255, 1)",
          ease: "power4.out",
          duration: 0.6,
        });
      } else {
        syncControls(1, endIndex);
      }
    } else if (startVal === endVal) {
      // Do nothing
    } else if (startVal < endVal) {
      difference = startIndex - endIndex;
      // Prev: startVal < endVal
      if (difference > 1) {
        // Find the indexes we passed over
        // console.log("prev difference", startIndex, endIndex);
        for (let i = startIndex; i >= endIndex; i--) {
          gsap.to(counterElsRef.current[i], {
            margin: "0 0.4rem",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            ease: "power4.out",
            duration: 0.6,
          });
        }
        if (endIndex === 0) {
          gsap.to(counterElsRef.current[0], {
            margin: "0 2rem 0 0.4rem",
            backgroundColor: "rgba(255, 255, 255, 1)",
            ease: "power4.out",
            duration: 0.6,
          });
        } else {
          gsap.to(counterElsRef.current[0], {
            backgroundColor: "rgba(255, 255, 255, 1)",
            ease: "power4.out",
            duration: 0.6,
          });
          gsap.to(counterElsRef.current[endIndex], {
            margin: "0 2rem 0 0.4rem",
            backgroundColor: "rgba(255, 255, 255, 1)",
            ease: "power4.out",
            duration: 0.6,
          });
        }
      } else {
        syncControls(-1, endIndex);
      }
    }
  };

  const syncControls = (dir, endIndex) => {
    let thisIndex = endIndex - dir;
    // console.log("thisIndex: " + thisIndex, "endIndex: " + endIndex);

    // Counter movement
    gsap.to(counterElsRef.current[endIndex], {
      margin: "0 2rem 0 0.4rem",
      backgroundColor: "rgba(255, 255, 255, 1)",
      ease: "power4.out",
      duration: 0.6,
    });
    if (dir === 1) {
      gsap.to(counterElsRef.current[thisIndex], {
        margin: "0 0.4rem",
        backgroundColor: "rgba(255, 255, 255, 1)",
        ease: "power4.out",
        duration: 0.6,
      });
    }
    if (dir === -1) {
      gsap.to(counterElsRef.current[thisIndex], {
        margin: "0 0.4rem",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        ease: "power4.out",
        duration: 0.6,
      });
    }
  };

  // Animations
  const animate = (dir) => {
    let newIndex = index + dir;
    // console.log("index: " + index, "newIndex: " + newIndex);
    setIndex(newIndex);
    x = newIndex * gridWidth * -1;
    // console.log("x: " + x);

    // Slide movement
    gsap.to(sliderRef, {
      x: x,
      ease: "power4.out",
      duration: 0.6,
    });

    // Counter movement
    gsap.to(counterElsRef.current[newIndex], {
      margin: "0 2rem 0 0.4rem",
      backgroundColor: "rgba(255, 255, 255, 1)",
      ease: "power4.out",
      duration: 0.6,
    });
    if (dir === 1) {
      gsap.to(counterElsRef.current[index], {
        margin: "0 0.4rem",
        backgroundColor: "rgba(255, 255, 255, 1)",
        ease: "power4.out",
        duration: 0.6,
      });
    }
    if (dir === -1) {
      gsap.to(counterElsRef.current[index], {
        margin: "0 0.4rem",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        ease: "power4.out",
        duration: 0.6,
      });
    }
  };

  useEffect(() => {
    createDraggable();
  }, []);

  return (
    <Container>
      <Slider>
        <SlideWrapper ref={(el) => (sliderRef = el)}>
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
              <Slide key={id} className={position}>
                <img src={src} alt={alt} />
              </Slide>
            );
          })}
        </SlideWrapper>
        <Counters>
          {items.map((item, itemIndex) => {
            let position = "";
            if (itemIndex === index) {
              position = "active";
            }
            if (itemIndex < index) {
              position = "visited";
            }
            return (
              <Counter
                key={item.id}
                position={position}
                ref={(el) => (counterElsRef.current[itemIndex] = el)}
              ></Counter>
            );
          })}
        </Counters>
        <Controls>
          <Button
            type="button"
            prev
            className="btn"
            disabled={prevDisabled}
            onClick={() => animate(-1)}
          >
            <img src="./arrow.svg" alt="View previous slide" />
          </Button>
          <Button
            type="button"
            next
            className="btn"
            disabled={nextDisabled}
            onClick={() => animate(1)}
          >
            <img src="./arrow.svg" alt="View next slide" />
          </Button>
        </Controls>
      </Slider>
    </Container>
  );
}

// Styled Components - General
const Container = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Slider = styled.div`
  position: relative;
  width: 100%;
  max-width: 59rem;
  height: 100%;
  min-height: 40rem;
  max-height: 68rem;
  overflow: hidden;
`;

const SlideWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`;

const Slide = styled.div`
  width: 100%;
  height: 100%;
  picture {
    display: block;
  }
  img {
    display: block;
    width: 100vw;
    max-width: 59rem;
    height: 100vh;
    min-height: 40rem;
    max-height: 68rem;
    object-fit: cover;
  }
`;

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
