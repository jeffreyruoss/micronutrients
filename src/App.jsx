import { useState, useEffect, useMemo } from 'react';
import { Container, Paper, Stack, LoadingOverlay, Button, Alert, Modal, Title, Text, List, ThemeIcon, Group } from '@mantine/core';
import { IconDownload, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { jsPDF } from 'jspdf';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { NutrientTable } from './components/NutrientTable';
import { NutrientModal } from './components/NutrientModal';

function App() {
  const [data, setData] = useState([]);
  const [foodData, setFoodData] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [risk, setRisk] = useState(null);
  const [essential, setEssential] = useState(null);
  
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(() => localStorage.getItem('disclaimerAcknowledged') !== 'true');
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(() => localStorage.getItem('disclaimerAcknowledged') === 'true');

  const handleAcknowledge = () => {
    localStorage.setItem('disclaimerAcknowledged', 'true');
    setDisclaimerAcknowledged(true);
    setDisclaimerModalOpen(false);
  };

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}db.json`).then(res => res.json()),
      fetch(`${import.meta.env.BASE_URL}food_sources.json`).then(res => res.json())
    ])
      .then(([nutrientData, foodSources]) => {
        setData(nutrientData);
        setFoodData(foodSources);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.storage.toLowerCase().includes(search.toLowerCase());
      const matchesRisk = risk ? item.toxicity === risk : true;
      const matchesEssential = essential ? item.essential === essential : true;

      return matchesSearch && matchesRisk && matchesEssential;
    });
  }, [data, search, risk, essential]);

  const handleRowClick = (nutrient) => {
    setSelectedNutrient(nutrient);
    setModalOpened(true);
  };

  const handleReset = () => {
    setSearch('');
    setRisk(null);
    setEssential(null);
  };

  const downloadNutrientFacts = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    
    let y = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;

    data.forEach((n) => {
        let sentence = `${n.name} has an RDA of ${n.rda} and ${n.ul ? 'an upper limit of ' + n.ul : 'no upper limit'}. `;
        
        if (n.storage.toLowerCase().includes('not stored')) {
            sentence += `It is ${n.storage}. `;
        } else {
            sentence += `It has a storage duration of ${n.storage}. `;
        }

        sentence += `It has a ${n.toxicity.replace('_', ' ')} toxicity risk and is ${n.essential === 'essential' ? 'an essential' : 'a ' + n.essential} nutrient.`;

        if (n.notes) {
            sentence += ` Note: ${n.notes}`;
        }
        
        const splitText = doc.splitTextToSize(sentence, 190);
        
        if (y + (splitText.length * lineHeight) > pageHeight - 10) {
            doc.addPage();
            y = 10;
        }
        
        doc.text(splitText, 10, y);
        y += (splitText.length * lineHeight) + 2; // Extra spacing
    });
    
    doc.save('nutrient-facts.pdf');
  };

  const downloadFoodFacts = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    
    let y = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;

    data.forEach((n) => {
        const foods = foodData[n.id];
        if (!foods) return;

        const sentence = `${n.name} top vegan food sources are ${foods.vegan.join(', ')}. Top vegetarian sources are ${foods.vegetarian.join(', ')}. Top omnivore sources are ${foods.omnivore.join(', ')}.`;
        
        const splitText = doc.splitTextToSize(sentence, 190);
         
        if (y + (splitText.length * lineHeight) > pageHeight - 10) {
            doc.addPage();
            y = 10;
        }

        doc.text(splitText, 10, y);
        y += (splitText.length * lineHeight) + 2;
    });

    doc.save('food-facts.pdf');
  };

  return (
    <Container size="xl" py="xl">
        <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
        


        <Header>
            <Button leftSection={<IconDownload size={16} />} variant="light" color="salad-green.9" onClick={downloadNutrientFacts} size="xs" mr="xs">
                Nutrients PDF
            </Button>
            <Button leftSection={<IconDownload size={16} />} variant="light" color="salad-green.9" onClick={downloadFoodFacts} size="xs">
                Foods PDF
            </Button>
        </Header>

        <Alert variant="light" color="gray" mb="lg" p="sm" bg="rgba(43, 115, 102, 0.1)">
           <Group justify="space-between" align="center">
               <Group gap="xs">
                   <IconAlertCircle size={20} color="#2B7366" />
                   <Text size="sm" c="#2B7366"><Text span fw={700}>Data Disclaimer:</Text> Errors or omissions may occur. Please verify all information.</Text>
               </Group>
               <Button variant="outline" color="#2B7366" size="xs" onClick={() => setDisclaimerModalOpen(true)} style={{ borderColor: '#2B7366' }}>
                   Review Disclaimers
               </Button>
           </Group>
        </Alert>

        <Paper p="md">
            <Stack>
                <FilterBar
                    search={search} onSearchChange={setSearch}
                    risk={risk} onRiskChange={setRisk}
                    essential={essential} onEssentialChange={setEssential}
                    onReset={handleReset}
                />
                
                <NutrientTable data={filteredData} onRowClick={handleRowClick} />
            </Stack>
        </Paper>

        <NutrientModal 
            nutrient={selectedNutrient} 
            foodSources={foodData}
            opened={modalOpened} 
            onClose={() => setModalOpened(false)} 
        />

        <Modal 
            opened={disclaimerModalOpen} 
            onClose={() => setDisclaimerModalOpen(false)} 
            title={<Title order={2} size="h3" c="red.8">Important Legal & Medical Disclaimer</Title>}
            size="lg"
            closeOnClickOutside={disclaimerAcknowledged}
            closeOnEscape={disclaimerAcknowledged}
            withCloseButton={disclaimerAcknowledged}
        >
            <Stack gap="md">
                <Alert variant="light" color="red" icon={<IconAlertCircle />}>
                    Please read the following information carefully before using this application.
                </Alert>
                
                <List spacing="sm" size="sm" center icon={
                    <ThemeIcon color="red" size={24} radius="xl">
                        <IconAlertCircle size={16} />
                    </ThemeIcon>
                }>
                    <List.Item>
                        <Text fw={700} span>AI-Generated Content:</Text> The data presented has been synthesized using advanced AI technologies. While efforts are made to ensure accuracy, errors or omissions may occur.
                    </List.Item>
                    <List.Item>
                        <Text fw={700} span>Not Medical Advice:</Text> This information is for educational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment.
                    </List.Item>
                    <List.Item>
                        <Text fw={700} span>Use at Your Own Risk:</Text> You acknowledge that you use this application at your own risk. The creators assume no liability for any adverse effects.
                    </List.Item>
                    <List.Item>
                         <Text fw={700} span>Emergency:</Text> If you suspect you have a medical emergency, call your doctor or emergency services (911) immediately.
                    </List.Item>
                </List>

                <Group justify="flex-end" mt="md">
                    {!disclaimerAcknowledged ? (
                         <Button onClick={handleAcknowledge} color="red" leftSection={<IconCheck size={16} />}>
                            I Acknowledge & Agree
                        </Button>
                    ) : (
                        <Button onClick={() => setDisclaimerModalOpen(false)} variant="default">
                            Close
                        </Button>
                    )}
                   
                </Group>
            </Stack>
        </Modal>
    </Container>
  );
}

export default App;
