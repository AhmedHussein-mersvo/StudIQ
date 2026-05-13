import type { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { RecentStudyRecord } from '../../services/recentStudiesStorage';
import { getPalette } from '../../theme/palette';
import { useThemeStore } from '../../theme/themeStore';
import { isLargeScreen, isSmallScreen } from '../../utils/config';
import { mediumFont, semiBoldFont } from '../../utils/font';

type RecentStudyFileItemProps = {
  record: RecentStudyRecord;
  onPress: () => void;
  variant: 'carousel' | 'list';
  itemWidth?: number;
};

const iconBoxCarousel = isLargeScreen ? 52 : 44;
const iconBoxList = isLargeScreen ? 48 : 42;
const iconSizeCarousel = isLargeScreen ? 28 : 24;
const iconSizeList = isLargeScreen ? 26 : 22;

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export default function RecentStudyFileItem({
  record,
  onPress,
  variant,
  itemWidth,
}: RecentStudyFileItemProps) {
  const colorScheme = useThemeStore(s => s.colorScheme);
  const p = getPalette(colorScheme);

  if (variant === 'list') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[
          styles.listRow,
          {
            borderColor: p.rowBorder,
            backgroundColor: p.cardBg,
            borderWidth: StyleSheet.hairlineWidth,
          },
        ]}
        className="flex-row items-center gap-3 rounded-2xl px-4 py-3"
      >
        <View
          style={[
            styles.iconWrap,
            {
              width: iconBoxList,
              height: iconBoxList,
              backgroundColor: `${record.iconColor}28`,
            },
          ]}
          className="items-center justify-center rounded-xl"
        >
          <MaterialIcons
            name={record.iconName as MaterialIconName}
            size={iconSizeList}
            color={record.iconColor}
          />
        </View>
        <Text
          style={[styles.listName, { color: p.textPrimary }]}
          className="flex-1"
          numberOfLines={2}
        >
          {record.fileName}
        </Text>
        <MaterialIcons
          name="chevron-right"
          size={22}
          color={p.chevron}
        />
      </TouchableOpacity>
    );
  }

  const widthStyle = itemWidth ? { width: itemWidth } : undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.carouselItem, widthStyle]}
      className="items-center"
    >
      <View
        style={[
          styles.iconWrap,
          {
            width: iconBoxCarousel,
            height: iconBoxCarousel,
            backgroundColor: `${record.iconColor}30`,
          },
        ]}
        className="items-center justify-center rounded-2xl"
      >
        <MaterialIcons
          name={record.iconName as MaterialIconName}
          size={iconSizeCarousel}
          color={record.iconColor}
        />
      </View>
      <Text
        style={[
          styles.carouselName,
          { color: p.carouselFileName },
        ]}
        className="mt-2 text-center"
        numberOfLines={2}
      >
        {record.fileName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  carouselItem: {
    paddingVertical: 4,
  },
  iconWrap: {
    alignSelf: 'center',
  },
  carouselName: {
    fontFamily: mediumFont,
    fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13,
    lineHeight: (isSmallScreen ? 12 : isLargeScreen ? 14 : 13) * 1.35,
  },
  listRow: {
    marginBottom: isLargeScreen ? 12 : 10,
  },
  listName: {
    fontFamily: semiBoldFont,
    fontSize: isLargeScreen ? 17 : 15,
    lineHeight: (isLargeScreen ? 17 : 15) * 1.35,
  },
});
