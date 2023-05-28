import type { SVGProps } from "react";

const XRoundSmall = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    {/* <path
      fill="#fff"
      fillOpacity={0.01}
      d="M12 21c4.9706 0 9-4.0294 9-9s-4.0294-9-9-9-9 4.0294-9 9 4.0294 9 9 9Z"
    /> */}
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m14.7 9.3-5.4 5.4m0-5.4 5.4 5.4"
    />
  </svg>
);

export default XRoundSmall;
