import { Box } from "@mui/material";
import gsap from "gsap/dist/gsap";
import Draggable from "gsap/dist/Draggable";
import { useEffect, useRef } from "react";

const Slide = ({}) => {
  return (
    <Box
      sx={{ width: "350px", height: "600px", backgroundColor: "green" }}
    ></Box>
  );
};

export const Slider = ({ minX, maxX }) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(Draggable);
    console.log(sliderRef.current.clientWidth, sliderRef.current.innerWidth);
    Draggable.create(sliderRef.current, {
      type: "x",
      bounds: {
        minX: minX,
        maxX: maxX,
      },
    });
  }, []);

  return (
    <Box
      id="slider"
      className="slider"
      ref={sliderRef}
      display="flex"
      flexDirection="row"
      columnGap={5}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((item, index) => {
        return <Slide key={index} />;
      })}
    </Box>
  );
};
