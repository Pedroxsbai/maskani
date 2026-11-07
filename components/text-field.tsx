import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  icon?: LucideIcon;
  prefix?: string;
  error?: string;
  trailing?: React.ReactNode;
};

function TextField({ label, icon, prefix, error, trailing, className, ...inputProps }: TextFieldProps) {
  const labelId = React.useId();

  return (
    <View className="gap-2">
      <Label nativeID={labelId}>{label}</Label>
      <View className="justify-center">
        <Input
          aria-labelledby={labelId}
          className={cn(
            'h-12 rounded-lg',
            prefix ? 'pl-16' : icon && 'pl-11',
            trailing && 'pr-12',
            error && 'border-destructive',
            className
          )}
          {...inputProps}
        />
        {icon || prefix ? (
          <View className="pointer-events-none absolute left-3 flex-row items-center gap-2">
            {icon ? <Icon as={icon} className="size-5 text-muted-foreground" /> : null}
            {prefix ? <Text>{prefix}</Text> : null}
          </View>
        ) : null}
        {trailing ? <View className="absolute right-1">{trailing}</View> : null}
      </View>
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
    </View>
  );
}

export { TextField };
export type { TextFieldProps };
