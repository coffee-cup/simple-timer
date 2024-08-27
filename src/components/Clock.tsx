import React from "react";

export const Clock = ({
  totalValue,
  currentValue,
  backgroundColor = "#e0e0e0",
  progressColor = "#3f51b5",
}: {
  totalValue: number;
  currentValue: number;
  backgroundColor?: string;
  progressColor?: string;
}) => {
  const size = 100;
  const radius = size / 2;
  const angle = (currentValue / totalValue) * 360;

  const getArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(radius, radius, radius, endAngle);
    const end = polarToCartesian(radius, radius, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${radius} ${radius} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const path = getArcPath(0, angle);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      // preserveAspectRatio="xMidYMid meet"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius - 22}
        strokeWidth={8}
        fill="none"
        className="stroke-pink-700"
      />
      <path d={path} stroke="none" className="fill-teal-200" />

      {/* <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="stroke-teal-200"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      /> */}
    </svg>
  );
};
