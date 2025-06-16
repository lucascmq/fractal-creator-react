import React from 'react';
import { Circle, Rect, Text } from 'react-konva';

export default function SnapMarker({ snapMarker }) {
  if (!snapMarker) return null;
  return (
    <>
      <Circle
        x={snapMarker.x}
        y={snapMarker.y}
        radius={4}
        fill="#FFD700"
        stroke="#000"
        strokeWidth={1}
      />
      <Rect
        x={snapMarker.x + 10}
        y={snapMarker.y - 24}
        width={80}
        height={28}
        fill="#181A20EE"
        stroke="#4CC674"
        strokeWidth={2}
        cornerRadius={7}
        shadowBlur={6}
        shadowColor={'#000'}
      />
      <Text
        x={snapMarker.x + 18}
        y={snapMarker.y - 18}
        text={`x: ${snapMarker.logical.x}  y: ${snapMarker.logical.y}`}
        fontSize={15}
        fontFamily="Rajdhani, monospace"
        fill="#7DF9A6"
        fontStyle="bold"
      />
    </>
  );
}
