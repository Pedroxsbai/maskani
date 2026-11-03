import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
};

function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <View className="size-16 items-center justify-center rounded-full bg-secondary">
        <Icon as={icon} className="size-8 text-primary" />
      </View>
      <Text variant="h4" className="text-center">
        {title}
      </Text>
      <Text variant="muted" className="text-center text-base">
        {description}
      </Text>
      {children}
    </View>
  );
}

export { EmptyState };
export type { EmptyStateProps };
