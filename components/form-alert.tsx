import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CircleAlertIcon } from 'lucide-react-native';
import { View } from 'react-native';

type FormAlertProps = {
  message: string;
};

function FormAlert({ message }: FormAlertProps) {
  return (
    <View role="alert" className="flex-row items-center gap-3 rounded-lg bg-destructive/10 p-3">
      <Icon as={CircleAlertIcon} className="size-5 text-destructive" />
      <Text className="flex-1 text-sm text-destructive">{message}</Text>
    </View>
  );
}

export { FormAlert };
