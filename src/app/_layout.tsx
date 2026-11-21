import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#ffffff' },
                    headerTintColor: '#111111',
                    headerTitleStyle: { fontWeight: '600' },
                    contentStyle: { backgroundColor: '#f5f5f7' },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Расписание',
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    );
}