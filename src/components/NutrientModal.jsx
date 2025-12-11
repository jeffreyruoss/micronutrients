import { Modal, Grid, Text, Badge, Box, Divider, Paper } from '@mantine/core';

export function NutrientModal({ nutrient, opened, onClose }) {
  if (!nutrient) return null;

  const getToxicityColor = (toxicity) => {
    switch (toxicity) {
      case 'very_high': return 'red.9';
      case 'high': return 'red';
      case 'moderate': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getEssentialityColor = (essential) => {
    switch (essential) {
      case 'essential': return 'green';
      case 'semi-essential': return 'lime';
      default: return 'gray';
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={<Text fw={700} size="lg">{nutrient.name}</Text>} size="lg">
      <Grid gutter="md">
        <Grid.Col span={6}>
            <Paper withBorder p="md" bg="var(--mantine-color-body)">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>RDA (Recommended)</Text>
                <Text size="xl" fw={700} c="teal">{nutrient.rda}</Text>
            </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
             <Paper withBorder p="md" bg="var(--mantine-color-body)">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Storage Duration</Text>
                <Text size="xl" fw={700}>{nutrient.storage}</Text>
            </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
            <Divider my="sm" />
        </Grid.Col>

        <Grid.Col span={4}>
            <Text size="sm" fw={500}>Toxicity Risk</Text>
            <Badge color={getToxicityColor(nutrient.toxicity)} mt={4}>
                {nutrient.toxicity.replace('_', ' ').toUpperCase()}
            </Badge>
        </Grid.Col>
        <Grid.Col span={4}>
            <Text size="sm" fw={500}>Essentiality</Text>
            <Badge color={getEssentialityColor(nutrient.essential)} variant="light" mt={4}>
                {nutrient.essential}
            </Badge>
        </Grid.Col>
         <Grid.Col span={4}>
            <Text size="sm" fw={500}>Tier</Text>
             <Badge variant="outline" mt={4}>
                {nutrient.tier.replace(/tier_\d_/, '').toUpperCase()}
            </Badge>
        </Grid.Col>

        {nutrient.ul && (
            <Grid.Col span={12} mt="md">
                 <Paper withBorder p="sm" bg="red.0" style={{ borderColor: 'var(--mantine-color-red-2)' }}>
                    <Text size="xs" c="red.9" tt="uppercase" fw={700}>Upper Limit (UL) - Danger Zone</Text>
                    <Text fw={500} c="red.9">{nutrient.ul}</Text>
                 </Paper>
            </Grid.Col>
        )}
      </Grid>
    </Modal>
  );
}
