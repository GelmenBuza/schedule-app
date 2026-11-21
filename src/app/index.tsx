import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getRawScheduleData } from '@/services/scheduleService';

export default function HomeScreen() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Подставьте путь до конкретной группы, если на главной только список категорий
    getRawScheduleData('/groups/301')
        .then((result) => setData(result))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.statusText}>Загрузка расписания...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.center}>
          <Text style={styles.errorText}>Ошибка: {error}</Text>
        </View>
    );
  }

  return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.code}>{JSON.stringify(data, null, 2)}</Text>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  statusText: { marginTop: 12, fontSize: 16 },
  errorText: { color: '#d32f2f', fontSize: 16, textAlign: 'center' },
  code: { fontFamily: 'monospace', fontSize: 12 },
});