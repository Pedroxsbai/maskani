import { useColorScheme } from 'nativewind';
import { Image, type ImageSourcePropType } from 'react-native';

type LogoVariant = 'mark' | 'wordmark';

type ColorSchemeName = 'light' | 'dark';

const LOGO_SOURCES: Record<LogoVariant, Record<ColorSchemeName, ImageSourcePropType>> = {
  mark: {
    light: require('@/assets/images/maskani-logo.png'),
    dark: require('@/assets/images/maskani-logo.png'),
  },
  wordmark: {
    light: require('@/assets/images/maskani-wordmark.png'),
    dark: require('@/assets/images/maskani-wordmark-light.png'),
  },
};

const ASPECT_RATIOS: Record<LogoVariant, number> = {
  mark: 512 / 448,
  wordmark: 720 / 117,
};

type MaskaniLogoProps = {
  variant?: LogoVariant;
  width: number;
};

function MaskaniLogo({ variant = 'wordmark', width }: MaskaniLogoProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Image
      source={LOGO_SOURCES[variant][colorScheme ?? 'light']}
      style={{ width, height: width / ASPECT_RATIOS[variant] }}
      resizeMode="contain"
      accessibilityLabel="MASKANI"
    />
  );
}

export { MaskaniLogo };
export type { MaskaniLogoProps };
