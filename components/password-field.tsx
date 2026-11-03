import { TextField, type TextFieldProps } from '@/components/text-field';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react-native';
import * as React from 'react';

type PasswordFieldProps = Omit<TextFieldProps, 'icon' | 'prefix' | 'trailing' | 'secureTextEntry'>;

function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <TextField
      icon={LockIcon}
      secureTextEntry={!isVisible}
      autoCapitalize="none"
      autoCorrect={false}
      trailing={
        <Button
          variant="ghost"
          size="icon"
          onPress={() => setIsVisible(!isVisible)}
          accessibilityLabel={isVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
          <Icon as={isVisible ? EyeOffIcon : EyeIcon} className="size-5 text-muted-foreground" />
        </Button>
      }
      {...props}
    />
  );
}

export { PasswordField };
