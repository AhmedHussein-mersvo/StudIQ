import { StyleSheet, Text, View } from 'react-native';
import { boldFont, regularFont } from '../../utils/font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
type GreetingsProps = {
  name: string;
};

export default function Greetings({ name }: GreetingsProps) {
  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-2">
        <Text className="text-2xl font-bold text-white" style={styles.title}>Hello, {name}</Text>
        <MaterialIcons name="waving-hand" size={24} color={'#fbcb42'} />
      </View>
      <Text className="text-base text-white" style={styles.subtitle}>
        What would you like to learn today?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: regularFont,
  },
  title: {
    fontFamily: boldFont,
  },
});
