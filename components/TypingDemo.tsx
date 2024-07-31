import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

// Definimos un tipo para las props del componente
type TypingDemoProps = {
  text: string;
  color?: string;
};

const TypingDemo: React.FC<TypingDemoProps> = ({ text, color = '#ffff' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);
  const blinkAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startTyping = () => {
      setDisplayedText('');
      index.current = 0;

      intervalRef.current = setInterval(() => {
        setDisplayedText((prev) => prev + text[index.current]);
        index.current += 1;
        if (index.current === text.length) {
          clearInterval(intervalRef.current!);
          setTimeout(() => startTyping(), 3000); // Reinicia después de 5 segundos
        }
      }, 100);
    };

    startTyping();
  }, [text]);

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    blinkAnimation.start();

    return () => {
      blinkAnimation.stop();
    };
  }, [blinkAnim]);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.typingDemo, { color }]}>
        {displayedText}
        <Animated.Text style={[styles.cursor, { opacity: blinkAnim }]}>|</Animated.Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    typingDemo: {
      fontSize: 14,
      fontWeight: 'bold', // Ajustamos el peso a negrita
    },
    cursor: {
      fontSize: 28,
      fontWeight: 'bold', // Ajustamos el peso a negrita
      color: 'yellow',
    },
  });

export default TypingDemo;