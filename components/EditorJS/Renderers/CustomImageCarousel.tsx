import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import { ArrowBackIosSharp, ArrowForwardIosSharp } from "@mui/icons-material";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
const { convert } = require("html-to-text");

type CarouselItem = {
  url: string;
  caption: string;
};

// Editor.js Image Carousel Renderer
export const CustomImageCarousel = (props: EditorjsRendererProps) => {
  const isCarouselItem = (item: any): item is CarouselItem => {
    return item.url !== undefined && item.caption !== undefined;
  };
  const carouselItems: CarouselItem[] =
    props.data.items!.filter(isCarouselItem);
  return <ImageCarousel items={carouselItems} infinite={false} />;
};

// Image Carousel Component
export const ImageCarousel = ({
  items,
  infinite = false,
}: {
  items: CarouselItem[];
  infinite?: boolean;
}) => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Navigation logic with infinite loop support
  const goTo = (index: number) => {
    let newIndex = index;

    if (infinite) {
      // Handle infinite looping - wrap around from last to first and vice versa[5]
      if (index < 0) {
        newIndex = items.length - 1;
      } else if (index >= items.length) {
        newIndex = 0;
      } else {
        newIndex = index;
      }
    } else {
      // Clamp to bounds when not infinite[5]
      newIndex = Math.max(0, Math.min(index, items.length - 1));
    }

    setActiveIndex(newIndex);
  };

  // Touch handlers for swipe functionality - one image at a time[8]
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default scrolling behavior during horizontal swipes[8]
    if (touchStartX.current !== null && touchStartY.current !== null) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - touchStartX.current);
      const diffY = Math.abs(currentY - touchStartY.current);

      // If horizontal swipe is more significant than vertical, prevent scrolling
      if (diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = Math.abs(touchStartY.current - touchEndY);

    // Only trigger swipe if horizontal movement is more significant than vertical
    // and exceeds minimum threshold - ensures one image at a time movement[8]
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        // Swipe left - go to next
        goTo(activeIndex + 1);
      } else {
        // Swipe right - go to previous
        goTo(activeIndex - 1);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    gsap.to(slidesRef.current, {
      xPercent: -100 * activeIndex,
      duration: 0.15,
      ease: "power3.out",
    });
  }, [activeIndex, items.length]);

  // Determine if buttons should be disabled based on infinite prop[5]
  const isPrevDisabled = !infinite && activeIndex <= 0;
  const isNextDisabled = !infinite && activeIndex >= items.length - 1;

  return (
    <Box
      sx={{
        mt: 4,
        mb: 2,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ToggleButtonGroup
        size="small"
        sx={{ pb: 1.5 }}
        // sx={{ paddingRight: 1, position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)" }}
      >
        <ToggleButton
          disableFocusRipple
          value
          sx={{
            width: 30,
            height: 34,
            borderRadius: "10px",
            color: theme.palette.text.primary,
            "&:disabled": {
              color: theme.palette.text.primary + "50",
            },
            "&:focus-visible": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[50],
            },
          }}
          disabled={isPrevDisabled}
          onClick={() => {
            goTo(activeIndex - 1);
          }}
        >
          <Tooltip enterDelay={2000} title="Previous">
            <ArrowBackIosSharp
              sx={{
                height: 16,
                width: 16,
                color: "inherit",
              }}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          disableFocusRipple
          value
          sx={{
            width: 60,
            height: 34,
            borderRadius: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled
        >
          <Typography
            variant="subtitle2"
            color="textPrimary"
            fontFamily={theme.typography.fontFamily}
          >
            {activeIndex + 1} / {items.length}
          </Typography>
        </ToggleButton>
        <ToggleButton
          disableFocusRipple
          value
          sx={{
            width: 30,
            height: 34,
            borderRadius: "10px",
            color: theme.palette.text.primary,
            "&:disabled": {
              color: theme.palette.text.primary + "50",
            },
            "&:focus-visible": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[50],
            },
          }}
          disabled={isNextDisabled}
          onClick={() => {
            goTo(activeIndex + 1);
          }}
        >
          <Tooltip enterDelay={2000} title="Next">
            <ArrowForwardIosSharp
              sx={{
                height: 16,
                width: 16,
                color: "inherit",
              }}
            />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <Box
        ref={carouselRef}
        sx={{
          display: "flex",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            //@ts-ignore
            ref={(el) => (slidesRef.current[index] = el)}
            sx={{
              minWidth: "100%",
              transition: "transform 0.5s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={item.url}
              alt={item.caption}
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "5px",
                padding: "0px 5px",
              }}
            />
            <Typography
              variant="body2"
              sx={{ mt: 1, color: theme.palette.text.primary }}
            >
              {convert(item.caption).trimEnd()}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Dots for navigation */}
      {/*
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        {items.map((_, index) => (
          <Box
            key={index}
            //@ts-ignore
            ref={(el) => (paginationRef.current[index] = el)}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: activeIndex === index ? theme.palette.primary.main : theme.palette.grey[400],
              margin: "0 5px",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>
      */}
    </Box>
  );
};

export default CustomImageCarousel;
