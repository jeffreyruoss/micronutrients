import { Modal, Grid, Text, Badge, Box, Divider, Paper, List, Group, ThemeIcon } from '@mantine/core';
import { IconLeaf, IconMeat, IconCheese, IconInfoCircle, IconBook } from '@tabler/icons-react';
import { NutrientBar } from './NutrientBar';

export function NutrientModal({ nutrient, foodSources, infoSources, opened, onClose }) {
  if (!nutrient) return null;

  const foods = foodSources && foodSources[nutrient.id];
  const sources = infoSources && infoSources[nutrient.id];

  const getToxicityColor = (toxicity) => {
    switch (toxicity) {
      case 'very_high': return 'red.9';
      case 'high': return 'red';
      case 'moderate': return 'yellow';
      case 'low': return 'salad-green';
      default: return 'gray';
    }
  };

  const getEssentialityColor = (essential) => {
    switch (essential) {
      case 'essential': return 'salad-green';
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
                <Text size="xl" fw={700} c="salad-green.8">{nutrient.rda}</Text>
            </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
             <Paper withBorder p="md" bg="var(--mantine-color-body)">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Storage Duration</Text>
                <Text size="xl" fw={700}>{nutrient.storage}</Text>
            </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
             <Paper withBorder p="md" bg="var(--mantine-color-body)">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">Intake Range Visual</Text>
                <Box py="xs">
                    <NutrientBar rdaStr={nutrient.rda} ulStr={nutrient.ul} />
                </Box>
            </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
            <Divider my="sm" />
        </Grid.Col>

        <Grid.Col span={6}>
            <Text size="sm" fw={500}>Toxicity Risk</Text>
            <Badge color={getToxicityColor(nutrient.toxicity)} mt={4}>
                {nutrient.toxicity.replace('_', ' ').toUpperCase()}
            </Badge>
        </Grid.Col>
        <Grid.Col span={6}>
            <Text size="sm" fw={500}>Essentiality</Text>
            <Badge color={getEssentialityColor(nutrient.essential)} variant="light" mt={4}>
                {nutrient.essential}
            </Badge>
        </Grid.Col>

        {nutrient.notes && (
             <Grid.Col span={12}>
                 <Paper withBorder p="sm" bg="blue.0" style={{ borderColor: 'var(--mantine-color-blue-2)' }}>
                    <Group gap="xs" mb={4}>
                        <IconInfoCircle size={16} color="var(--mantine-color-blue-6)" /> 
                        <Text size="xs" c="blue.8" tt="uppercase" fw={700}>Special Note</Text>
                    </Group>
                    <Text size="sm" c="blue.9">{nutrient.notes}</Text>
                 </Paper>
            </Grid.Col>
        )}

        {nutrient.ul && (
            <Grid.Col span={12} mt="md">
                 <Paper withBorder p="sm" bg="red.0" style={{ borderColor: 'var(--mantine-color-red-2)' }}>
                    <Text size="xs" c="red.9" tt="uppercase" fw={700}>Upper Limit (UL) - Danger Zone</Text>
                    <Text fw={500} c="red.9">{nutrient.ul}</Text>
                 </Paper>
            </Grid.Col>
        )}

        {foods && (
            <Grid.Col span={12}>
                <Divider my="md" label="Top Food Sources" labelPosition="center" />
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                        <Group mb="xs">
                           <ThemeIcon color="salad-green" variant="light"><IconLeaf size={16} /></ThemeIcon>
                           <Text fw={700} size="sm">Vegan</Text>
                        </Group>
                        <List size="sm" spacing="xs" icon={<Text size="xs">🌱</Text>}>
                            {foods.vegan.map((item, index) => (
                                <List.Item key={index}>{item}</List.Item>
                            ))}
                        </List>
                    </Grid.Col>
                    
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                        <Group mb="xs">
                           <ThemeIcon color="lime" variant="light"><IconCheese size={16} /></ThemeIcon>
                           <Text fw={700} size="sm">Vegetarian</Text>
                        </Group>
                         <List size="sm" spacing="xs" icon={<Text size="xs">🧀</Text>}>
                            {foods.vegetarian.map((item, index) => (
                                <List.Item key={index}>{item}</List.Item>
                            ))}
                        </List>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 4 }}>
                         <Group mb="xs">
                           <ThemeIcon color="red" variant="light"><IconMeat size={16} /></ThemeIcon>
                           <Text fw={700} size="sm">Omnivore</Text>
                        </Group>
                        <List size="sm" spacing="xs" icon={<Text size="xs">🍖</Text>}>
                            {foods.omnivore.map((item, index) => (
                                <List.Item key={index}>{item}</List.Item>
                            ))}
                        </List>
                    </Grid.Col>
                </Grid>

                {foods.notes && (
                    <Paper withBorder p="sm" bg="orange.0" mt="md" style={{ borderColor: 'var(--mantine-color-orange-2)' }}>
                        <Group gap="xs" mb={4}>
                            <IconInfoCircle size={16} color="var(--mantine-color-orange-6)" /> 
                            <Text size="xs" c="orange.8" tt="uppercase" fw={700}>Food Source Facts</Text>
                        </Group>
                        <Text size="sm" c="orange.9">{foods.notes}</Text>
                    </Paper>
                )}
            </Grid.Col>
        )}

        {sources && sources.length > 0 && (
             <Grid.Col span={12}>
                <Divider my="md" label="Information Sources" labelPosition="center" />
                <Paper withBorder p="md" bg="gray.0">
                    <Group mb="sm">
                        <IconBook size={18} />
                        <Text fw={700} size="sm">References & Further Reading</Text>
                    </Group>
                    <List size="xs" spacing={4}>
                        {sources.map((source, idx) => (
                            <List.Item key={idx}>
                                {source.url ? (
                                    <Text component="a" href={source.url} target="_blank" c="blue" td="underline">
                                        {source.title || source.url}
                                    </Text>
                                ) : (
                                    <Text>{source.title || source}</Text>
                                )}
                            </List.Item>
                        ))}
                    </List>
                </Paper>
             </Grid.Col>
        )}
      </Grid>
    </Modal>
  );
}
