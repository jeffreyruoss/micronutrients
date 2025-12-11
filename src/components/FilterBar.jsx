import { Group, TextInput, Select, Button, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

export function FilterBar({ 
    search, onSearchChange,
    tier, onTierChange,
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
        minWidth={200}
        label="Search"
      />
      
      <Select
        label="Tier"
        placeholder="Filter by filter"
        data={[
          { value: 'tier_1_daily', label: 'Daily (Tier 1)' },
          { value: 'tier_2_weekly', label: 'Weekly (Tier 2)' },
          { value: 'tier_3_monthly', label: 'Monthly (Tier 3)' },
          { value: 'tier_4_quarterly', label: 'Quarterly (Tier 4)' },
        ]}
        value={tier}
        onChange={onTierChange}
        clearable
        minWidth={160}
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
        minWidth={150}
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
        minWidth={140}
      />

      <Button variant="light" color="gray" onClick={onReset} leftSection={<IconX size={16} />}>
        Reset
      </Button>
    </Group>
  );
}
