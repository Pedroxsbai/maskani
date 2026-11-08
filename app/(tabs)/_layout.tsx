
import { Tabs } from 'expo-router';
import {
  CalendarCheckIcon,
  HeartIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
  UserIcon,
  type LucideIcon,
} from 'lucide-react-native';
import type { ColorValue } from 'react-native';

type TabIconProps = {
  color: ColorValue;
  size: number;
};

function renderTabIcon(IconComponent: LucideIcon) {
  return ({ color, size }: TabIconProps) => (
    <IconComponent
      color={typeof color === 'string' ? color : undefined}
      size={size}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorer',
          tabBarIcon: renderTabIcon(SearchIcon),
        }}
      />

      <Tabs.Screen
        name="my-listings"
        options={{
          title: 'Mes annonces',
          tabBarIcon: renderTabIcon(HomeIcon),
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favoris',
          tabBarIcon: renderTabIcon(HeartIcon),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: renderTabIcon(MessageCircleIcon),
        }}
      />

      <Tabs.Screen
        name="visits"
        options={{
          title: 'Visites',
          tabBarIcon: renderTabIcon(CalendarCheckIcon),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: renderTabIcon(UserIcon),
        }}
      />
    </Tabs>
  );
}
