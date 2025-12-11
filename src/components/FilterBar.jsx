import { Group, TextInput, Select, Button, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

export function FilterBar({ 
    search, onSearchChange,

    risk, onRiskChange,
    essential, onEssentialChange,
    onReset
}) {
  return (
    <Group mb="md" align="end">
      <TextInput
        placeholder="Search micronutrients..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        style={{ flex: 1 }}
        miw={200}
        label="Search"
      />
      


      <Select
        label="Toxicity Risk"
        placeholder="Any Risk"
        data={[
          { value: 'very_high', label: '🔴 Very High' },
          { value: 'high', label: '🔴 High' },
          { value: 'moderate', label: '🟡 Moderate' },
          { value: 'low', label: '🟢 Low' },
        ]}
        value={risk}
        onChange={onRiskChange}
        clearable
        miw={160}
      />

      <Select
        label="Essentiality"
        placeholder="Any Type"
        data={[
            { value: 'essential', label: 'Essential' },
            { value: 'semi-essential', label: 'Semi-Essential' },
            { value: 'non-essential', label: 'Non-Essential' },
        ]}
        value={essential}
        onChange={onEssentialChange}
        clearable
        miw={140}
      />

      <Button variant="light" color="gray" onClick={onReset} leftSection={<IconX size={16} />}>
        Reset
      </Button>
    </Group>
  );
}
