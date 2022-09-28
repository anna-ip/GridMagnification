import {
  Extrapolate,
  Group,
  interpolate,
  RoundedRect,
  SkiaMutableValue,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_DISTANCE } from '../constants';

interface RoundedSquareProps {
  x: number;
  y: number;
  width: number;
  height: number;
  point: SkiaMutableValue<{
    x: number;
    y: number;
  } | null>;
  progress: SkiaMutableValue<number>;
}

export const RoundedSquare = React.memo(
  ({ point, progress, ...squareProps }: RoundedSquareProps) => {
    const { x, y } = squareProps;
    const previousDistance = useValue(0);
    const previousTouchedPoint = useValue({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
    });

    //useComputedValue is used when computed values base on other Skia values
    //the distance value is dependant of the point skia values
    const distance = useComputedValue(() => {
      if (point.current == null) return previousDistance.current;
      previousDistance.current = Math.sqrt(
        (point.current.x - x) ** 2 + (point.current.y - y) ** 2
      );
      return previousDistance.current;
    }, [point]);

    const scale = useComputedValue(() => {
      // if distance is close to zero we want it to scale to 1
      return interpolate(
        distance.current * progress.current,
        [0, MAX_DISTANCE / 2],
        [1, 0],
        {
          extrapolateLeft: Extrapolate.CLAMP,
          extrapolateRight: Extrapolate.CLAMP,
        }
      );
    }, [distance, progress]);

    const transform = useComputedValue(() => {
      return [{ scale: scale.current }];
    }, [scale]);

    const origin = useComputedValue(() => {
      if (point.current == null) {
        return previousTouchedPoint.current;
      }
      previousTouchedPoint.current = point.current;
      return previousTouchedPoint.current;
    }, [point]);

    return (
      <Group origin={origin} transform={transform}>
        <RoundedRect {...squareProps} r={4} />
      </Group>
    );
  }
);
