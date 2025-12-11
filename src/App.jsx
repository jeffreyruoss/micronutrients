import { useState, useEffect, useMemo } from 'react';
import { Container, Paper, Stack, LoadingOverlay } from '@mantine/core';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { NutrientTable } from './components/NutrientTable';
import { NutrientModal } from './components/NutrientModal';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [risk, setRisk] = useState(null);
  const [essential, setEssential] = useState(null);
  
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}db.json`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
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

  return (
    <Container size="xl" py="xl">
        <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Header />

        <Paper shadow="sm" p="md" withBorder>
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
            opened={modalOpened} 
            onClose={() => setModalOpened(false)} 
        />
    </Container>
  );
}

export default App;
