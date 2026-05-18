import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COUNTRIES, type Country } from '../data/countries';
import type { RootStackParamList } from '../navigation/types';
import { getPalette } from '../theme/palette';
import { useThemeStore } from '../theme/themeStore';
import { isLargeScreen } from '../utils/config';
import { mediumFont, regularFont, semiBoldFont } from '../utils/font';
import { getScreenContentPaddingHorizontal } from '../utils/screenPadding';

type Props = StackScreenProps<RootStackParamList, 'CountrySelect'>;

export default function CountrySelectScreen({ navigation, route }: Props) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);
  const insets = useSafeAreaInsets();
  const selectedCountry = route.params?.currentCountry ?? '';
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return COUNTRIES;
    }
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q));
  }, [query]);

  const selectCountry = (country: Country) => {
    navigation.navigate({
      name: 'Register',
      params: { country: country.name },
      merge: true,
    });
  };

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: p.gradient[0],
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 8,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: p.textPrimary }]}>
            Select country
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
            <MaterialIcons name="close" size={26} color={p.textPrimary} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.searchRow,
            {
              backgroundColor: p.inputBg,
              borderColor: p.inputBorder,
            },
          ]}
        >
          <MaterialIcons name="search" size={22} color={p.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search countries"
            placeholderTextColor={p.inputPlaceholder}
            style={[styles.searchInput, { color: p.inputText }]}
            autoCorrect={false}
            autoFocus
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.code}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: p.textMuted }]}>
              No countries found
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.countryRow,
                {
                  borderBottomColor: p.divider,
                  backgroundColor:
                    item.name === selectedCountry ? p.rowBg : 'transparent',
                },
              ]}
              onPress={() => selectCountry(item)}
            >
              <Text style={[styles.countryName, { color: p.textPrimary }]}>
                {item.name}
              </Text>
              {item.name === selectedCountry ? (
                <MaterialIcons name="check" size={20} color={p.tabActive} />
              ) : null}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: getScreenContentPaddingHorizontal(),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 4,
  },
  title: {
    fontFamily: semiBoldFont,
    fontSize: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: regularFont,
    fontSize: 15,
    paddingVertical: 10,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyText: {
    fontFamily: regularFont,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 24,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  countryName: {
    fontFamily: regularFont,
    fontSize: 16,
  },
});
