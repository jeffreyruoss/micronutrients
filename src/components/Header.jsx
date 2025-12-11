import { Container, Title, Text, Group, Paper } from '@mantine/core';

export function Header({ children }) {
  return (
    <Paper p="md" mb="xl" component="header">
        <Group justify="space-between" align="center">
            <Group>
                <Text fz={50} style={{ lineHeight: 1 }}>🥗</Text>
                <div>
                    <Title order={1} size="h3" c="salad-green.8">Micronutrients</Title>
                    <Text size="sm" c="dimmed">Storage Duration, Toxicity, Essentiality</Text>
                </div>
            </Group>
            <Group>
                {children}
            </Group>
        </Group>
    </Paper>
  );
}
