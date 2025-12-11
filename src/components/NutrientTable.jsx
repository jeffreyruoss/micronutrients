import { useState } from 'react';
import { Table, ScrollArea, UnstyledButton, Group, Text, Center, Badge, Card, Stack, SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSelector, IconChevronDown, IconChevronUp, IconInfoCircle } from '@tabler/icons-react';
import { NutrientBar } from './NutrientBar';


// Styling for headers (we will create a css module or just use inline styles for now, prefer module but for speed inline/mantine props)
// Let's use standard Mantine styles.

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={700} fz="sm" style={{ whiteSpace: 'nowrap' }} c="salad-green.8">
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
      
      // Parse numbers for RDA and UL
      if (sortBy === 'rda' || sortBy === 'ul') {
          const extractNum = (str) => {
              if (!str) return -1;
              const match = str.match(/[\d.]+/);
              return match ? parseFloat(match[0]) : -1;
          };
          valueA = extractNum(valueA);
          valueB = extractNum(valueB);
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

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id} onClick={() => onRowClick(row)} style={{ cursor: 'pointer' }}>
      <Table.Td fw={500}>{row.name}</Table.Td>
      <Table.Td style={{ minWidth: 400, paddingRight: 'var(--mantine-spacing-xl)' }}>
          <NutrientBar rdaStr={row.rda} ulStr={row.ul} />
      </Table.Td>
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
      <Table.Td>
        <IconInfoCircle size={20} color="#5f9dcd" style={{ cursor: 'pointer' }} />
      </Table.Td>
    </Table.Tr>
  ));

  const isMobile = useMediaQuery('(max-width: 1023px)');

  if (isMobile) {
      return (
          <Stack>
              {sortedData.map(row => (
                  <Card key={row.id} shadow="sm" padding="lg" radius="md" withBorder onClick={() => onRowClick(row)}>
                      <Group justify="space-between" mb="xs">
                          <Text fw={700} size="lg">{row.name}</Text>
                          <IconInfoCircle size={20} color="#5f9dcd" />
                      </Group>
                      
                      <Stack gap="xs" mb="md">
                          <Text size="sm" c="dimmed">Intake Range</Text>
                          <NutrientBar rdaStr={row.rda} ulStr={row.ul} />
                      </Stack>

                      <SimpleGrid cols={2} spacing="xs">
                          <div>
                              <Text size="xs" c="dimmed">Storage</Text>
                              <Text size="sm" fw={500}>{row.storage}</Text>
                          </div>
                          <div>
                             <Text size="xs" c="dimmed">Essentiality</Text>
                             <Badge color={getEssentialityColor(row.essential)} variant="dot" size="sm">
                                {row.essential}
                            </Badge>
                          </div>
                           <div>
                              <Text size="xs" c="dimmed">Toxicity Risk</Text>
                              <Badge color={getToxicityColor(row.toxicity)} variant="light" size="sm">
                                {row.toxicity.replace('_', ' ')}
                            </Badge>
                          </div>
                      </SimpleGrid>
                  </Card>
              ))}
          </Stack>
      );
  }

  return (
    <ScrollArea>
      <Table horizontalSpacing="md" verticalSpacing="xs" highlightOnHover>
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
              sorted={sortBy === 'rda'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('rda')}
            >
              Intake Range (RDA vs UL)
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
            <Table.Th style={{ width: 40 }} />
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
