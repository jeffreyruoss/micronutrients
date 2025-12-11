import { Container, Title, Text, Group, Paper } from '@mantine/core';
import { IconSalad } from '@tabler/icons-react';

export function Header() {
  return (
    <Paper shadow="xs" p="md" mb="xl" component="header" withBorder>
        <Group justify="space-between" align="center">
            <Group>
                <IconSalad size={32} color="var(--mantine-color-teal-6)" />
                <div>
                    <Title order={1} size="h3">Micronutrient Tracker</Title>
                    <Text size="sm" c="dimmed">Daily, Weekly, Monthly, & Quarterly Requirements</Text>
                </div>
            </Group>
        </Group>
    </Paper>
  );
}
