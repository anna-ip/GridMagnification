import {
  Canvas,
  Group,
  runTiming,
  SweepGradient,
  useTouchHandler,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import { StyleSheet, View } from 'react-native';
import { RoundedSquare } from './src/components/RoundedSquare';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
  SQUARES_HORIZONTAL,
  SQUARES_VERTICAL,
  SQUARE_CONTAINER_SIZE,
  SQUARE_SIZE,
} from './src/constants';

export default function App() {
  const touchPoint = useValue<{ x: number; y: number } | null>(null);
  const progress = useValue<number>(0);

  const onTouchHandler = useTouchHandler({
    onStart: (event) => {
      runTiming(progress, 1, { duration: 300 });
      touchPoint.current = { x: event.x, y: event.y };
    },
    onActive: (event) => {
      touchPoint.current = { x: event.x, y: event.y };
    },
    onEnd: () => {
      runTiming(progress, 0, { duration: 300 });
      touchPoint.current = null;
    },
  });
  return (
    <View style={styles.container}>
      <Canvas
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
        onTouch={onTouchHandler}
      >
        <Group>
          {new Array(SQUARES_HORIZONTAL).fill(0).map((_, i) => {
            return new Array(SQUARES_VERTICAL)
              .fill(0)
              .map((_, j) => (
                <RoundedSquare
                  point={touchPoint}
                  progress={progress}
                  key={`${i}-${j}`}
                  x={i * SQUARE_CONTAINER_SIZE + PADDING / 2}
                  y={j * SQUARE_CONTAINER_SIZE + PADDING / 2}
                  width={SQUARE_SIZE}
                  height={SQUARE_SIZE}
                />
              ));
          })}
          <SweepGradient
            c={vec(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)} //centers the gradiant into the middle
            colors={['cyan', 'magenta', 'yellow', 'cyan']}
          />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
