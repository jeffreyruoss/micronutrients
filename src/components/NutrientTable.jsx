import { useState } from 'react';
import { Table, ScrollArea, UnstyledButton, Group, Text, Center, Badge } from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp } from '@tabler/icons-react';


// Styling for headers (we will create a css module or just use inline styles for now, prefer module but for speed inline/mantine props)
// Let's use standard Mantine styles.

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between">
          <Text fw={700} fz="sm" style={{ whiteSpace: 'nowrap' }}>
            {children}
          </Text>
          <Center>
            <Icon style={{ width: 16, height: 16 }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export function NutrientTable({ data, onRowClick }) {
  const [sortBy, setSortBy] = useState('name');
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const sortData = (data) => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];
      
      // Handle tier sorting specifically to respect 1, 2, 3, 4 order
      if (sortBy === 'tier') {
          // tier_1_daily -> 1, etc
          valueA = parseInt(valueA.split('_')[1] || 9);
          valueB = parseInt(valueB.split('_')[1] || 9);
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
          return reverseSortDirection
          ? valueB.localeCompare(valueA)
          : valueA.localeCompare(valueB);
      }

      return reverseSortDirection ? (valueB > valueA ? 1 : -1) : (valueA > valueB ? 1 : -1);
    });
  };

  const sortedData = sortData(data);

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

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id} onClick={() => onRowClick(row)} style={{ cursor: 'pointer' }}>
      <Table.Td fw={500}>{row.name}</Table.Td>
      <Table.Td>
          <Badge variant="light" color="blue">
            {row.tier.replace(/tier_(\d)_(\w+)/, (match, p1) => `Tier ${p1}`)}
          </Badge>
          <Text size="xs" c="dimmed">{row.tier.split('_').pop()}</Text>
      </Table.Td>
      <Table.Td>{row.rda}</Table.Td>
      <Table.Td>{row.storage}</Table.Td>
      <Table.Td>
        <Badge color={getToxicityColor(row.toxicity)} variant="light">
            {row.toxicity.replace('_', ' ')}
        </Badge>
      </Table.Td>
      <Table.Td>
         <Badge color={getEssentialityColor(row.essential)} variant="dot">
            {row.essential}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table horizontalSpacing="md" verticalSpacing="xs" highlightOnHover layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Micronutrient
            </Th>
            <Th
              sorted={sortBy === 'tier'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('tier')}
            >
              Tier
            </Th>
            <Th
              sorted={sortBy === 'rda'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('rda')}
            >
              RDA
            </Th>
            <Th
              sorted={sortBy === 'storage'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('storage')}
            >
              Storage Duration
            </Th>
            <Th
              sorted={sortBy === 'toxicity'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('toxicity')}
            >
              Toxicity Risk
            </Th>
            <Th
              sorted={sortBy === 'essential'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('essential')}
            >
              Essentiality
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center">Nothing found</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
