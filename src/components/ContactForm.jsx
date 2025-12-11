import { useState } from 'react';
import { 
  Text, 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  Stack,
  Alert
} from '@mantine/core';
import { IconSend, IconCheck, IconAlertCircle } from '@tabler/icons-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '21348fd0-a310-471b-aced-6f4400f38c29', // You'll need to replace this
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: 'New Contact Form Submission - Micronutrient Tracker'
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: 'Oops! Something went wrong. Please try again.'
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap="md">
      <div>
        <Text size="sm" c="dimmed">
          Have questions, feedback, or found an error in our data? We'd love to hear from you!
        </Text>
      </div>

      {status.message && (
        <Alert
          icon={status.type === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
          color={status.type === 'success' ? 'green' : 'red'}
          variant="light"
          onClose={() => setStatus({ type: '', message: '' })}
          withCloseButton
        >
          {status.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            disabled={isSubmitting}
          />

          <TextInput
            label="Email"
            placeholder="your.email@example.com"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            disabled={isSubmitting}
          />

          <Textarea
            label="Message"
            placeholder="Your message..."
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            required
            disabled={isSubmitting}
            minRows={5}
            autosize
          />

          <Group justify="flex-end">
            <Button
              type="submit"
              leftSection={<IconSend size={16} />}
              loading={isSubmitting}
              color="salad-green.9"
            >
              Send Message
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
