import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions, Easing } from 'react-native';

const TAGS = ['Coffee', 'Espresso', 'Latte', 'Cappuccino', 'Mocha', 'Donuts', 'Croissant', 'Bagel', 'Sandwich', 'Burger', 'Pizza', 'Hotdog'];
const DURATION = 20000;
const ROWS = 1;
const TAGS_PER_ROW = 3;

interface InfiniteLoopSliderProps {
  duration: number;
  reverse?: boolean;
}

const InfiniteLoopSlider: React.FC<InfiniteLoopSliderProps> = ({ duration, reverse = false }) => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const screenWidth = useWindowDimensions().width;

  useEffect(() => {
    const loopAnimation = () => {
      animationValue.setValue(0);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => loopAnimation());
    };

    loopAnimation();
  }, [animationValue, duration]);

  const translateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -screenWidth * 1],
  });

  const animatedStyle = {
    transform: [
      {
        translateX: reverse
          ? translateX.interpolate({ inputRange: [0, 1], outputRange: [-screenWidth, 0] })
          : translateX,
      },
    ],
  };

  return (
    <Animated.View style={[styles.loopSlider, animatedStyle]}>
      {TAGS.map((tag, index) => (
        <Tag text={tag} key={index} />
      ))}
    </Animated.View>
  );
};

interface TagProps {
  text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>#{text}</Text>
  </View>
);

const InfiniteScrollAnimation: React.FC = () => {
  return (
    <View style={styles.app}>
      <View style={styles.header}>
        <Text style={styles.title}>Elige de nuestros productos</Text>
        <Text style={styles.description}>Customizable, bi-directional, infinite scrolling</Text>
      </View>
      <View style={styles.tagList}>
        {[...Array(ROWS)].map((_, i) => (
          <View key={i} style={styles.row}>
            <InfiniteLoopSlider duration={DURATION} reverse={i % 2 === 1} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 18,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    color: '#f8fafc',
    marginBottom: 4,
  },
  description: {
    color: '#94a3b8',
  },
  tagList: {
    width: '90%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loopSlider: {
    flexDirection: 'row',
    width: '100%', // Ajusta según sea necesario para el tamaño de la animación
  },
  row: {
    width: '100%',
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 9,
    marginRight: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 5,
  },
  tagText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
});

export default InfiniteScrollAnimation;