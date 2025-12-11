import { Container, Group, Button, Text, Anchor } from '@mantine/core';
import { IconMail, IconBrandGithub } from '@tabler/icons-react';

export function Footer({ onContactClick }) {
  return (
    <Container size="xl" py="xl" mt="xl">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Created by
          </Text>
          <Anchor
            href="https://github.com/jeffreyruoss"
            target="_blank"
            rel="noopener noreferrer"
            c="salad-green.9"
            style={{ textDecoration: 'underline' }}
          >
            <Group gap={6}>
              <IconBrandGithub size={18} />
              <Text size="sm" fw={500}>
                Jeff Ruoss
              </Text>
            </Group>
          </Anchor>
        </Group>

        <Button
          leftSection={<IconMail size={16} />}
          variant="light"
          color="salad-green.9"
          onClick={onContactClick}
        >
          Contact
        </Button>
      </Group>
    </Container>
  );
}
