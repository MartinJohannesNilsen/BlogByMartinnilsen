import { RevealProps } from "../../types";
import { FC, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap/dist/gsap";

// Original Reveal Components

export const RevealFromDownOnEnter: FC<RevealProps> = (props) => {
  const root = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".box", {
        y: props.y || "+=10vh",
        opacity: props.from_opacity || 1,
        duration: props.duration || 1,
        delay: props.delay || 0,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="page" ref={root}>
      <div className="box">{props.children}</div>
    </div>
  );
};
