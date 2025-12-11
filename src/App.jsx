import { useState, useEffect, useMemo } from 'react';
import { Container, Paper, Stack, LoadingOverlay, Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
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
    </Container>
  );
}

export default App;
