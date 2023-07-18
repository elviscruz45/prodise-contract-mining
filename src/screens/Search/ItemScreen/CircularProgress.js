import React, { useState, useEffect } from "react";
import { VictoryPie, VictoryLabel, VictoryAnimation } from "victory-native";
import Svg from "react-native-svg";
import { View, Image } from "react-native";

export const CircularProgress = ({ imageSource, imageStyle, avance }) => {
  const [percent, setPercent] = useState(25);
  // const [data, setData] = useState([
  //   { x: 1, y: percent },
  //   { x: 2, y: 100 - percent },
  // ]);
  const [data, setData] = useState([
    { x: 1, y: avance },
    { x: 2, y: 100 - avance },
  ]);

  return (
    <>
      <Svg
        style={{ position: "absolute", top: -60, left: -50, zIndex: 100 }}
        width="200%"
        height="200%"
      >
        <VictoryPie
          standalone={false}
          // animate={{ duration: 1000 }}
          width={200}
          height={200}
          data={data}
          innerRadius={45}
          // cornerRadius={80}
          labels={() => null}
          style={{
            data: {
              fill: ({ datum }) => {
                const color =
                  datum.y < 20
                    ? "red"
                    : datum.y < 40
                    ? "magenta"
                    : datum.y < 60
                    ? "orange"
                    : datum.y < 80
                    ? "limegreen"
                    : datum.y < 100
                    ? "green"
                    : "blue";
                return datum.x === 1 ? color : "transparent";
              },
            },
          }}
        />
      </Svg>
      <Image
        source={imageSource}
        style={{
          marginLeft: 10,
          // ...imageStyle,
          width: 80,
          height: 80,
          // position: "absolute",
          borderRadius: 80,
          // left: 65, // Set the position along the x-axis (left)
          // top: 65, // Set the position along the y-axis (top)
        }}
      />
    </>
  );
};