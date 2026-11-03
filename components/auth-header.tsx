import { MaskaniLogo } from '@/components/maskani-logo';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="gap-6">
      <View className="items-center">
        <MaskaniLogo width={180} />
      </View>
      <View className="gap-2">
        <Text variant="h3">{title}</Text>
        <Text variant="muted" className="text-base">
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

export { AuthHeader };
