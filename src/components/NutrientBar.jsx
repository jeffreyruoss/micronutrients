import { Box, Text } from '@mantine/core';

export function NutrientBar({ rdaStr, ulStr }) {
  // Helper to parse value and unit
  const parse = (str) => {
    if (!str) return null;
    // Match "100-200" or "100"
    const rangeMatch = str.match(/([\d.]+)(?:\s*-\s*([\d.]+))?/);
    if (!rangeMatch) return null;
    
    // If range "100-200", use lower bound "100" for strict RDA, or maybe average?
    // For standard RDA, staying above the lower bound is key. Let's use lower bound.
    const val = parseFloat(rangeMatch[1]);
    
    const unitMatch = str.match(/(mg|mcg|IU)/i);
    const unit = unitMatch ? unitMatch[1] : '';
    
    return { val, unit };
  };

  const rda = parse(rdaStr);
  const ul = parse(ulStr);

  if (!rda) return null;

  // Determine Scale Max
  // If UL exists, scale so UL is at ~75% mark? Or 80%?
  // If no UL, scale so RDA is at ~33% or 50%
  // Let's ensure enough space for the red bar if UL exists.
  const hasUL = !!ul;
  
  // Note: Assuming units match if both exist.
  
  let maxValue;
  if (hasUL) {
      // Visualizing: 0 ... RDA ... UL ... (Danger)
      // Let's put UL at 80% width.
      maxValue = ul.val * 1.25; 
  } else {
      // No UL: 0 ... RDA ... (Safe zone extends)
      // Put RDA at 30% width?
      maxValue = rda.val * 3;
  }

  // Calculate percentages
  const rdaPct = Math.min((rda.val / maxValue) * 100, 100);
  const ulPct = hasUL ? Math.min((ul.val / maxValue) * 100, 100) : 100;

  const barHeight = 12;

  return (
    <Box w="100%" h={50} style={{ position: 'relative', minWidth: 200 }}>
        {/* Track container */}
        <Box 
            style={{ 
                position: 'absolute', 
                top: 18, 
                left: 0, 
                right: 0, 
                height: barHeight,
            }}
        >
            {/* Gray: 0 to RDA */}
            <Box 
                bg="gray.6" 
                style={{ 
                    position: 'absolute',
                    left: 0,
                    width: `${rdaPct}%`,
                    height: '100%',
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                }} 
            />

            {/* Green: RDA to UL (or End) */}
            <Box 
                bg="teal.6"
                style={{
                    position: 'absolute',
                    left: `${rdaPct}%`,
                    width: `${ulPct - rdaPct}%`,
                    height: '100%',
                    borderTopRightRadius: hasUL ? 0 : 4,
                    borderBottomRightRadius: hasUL ? 0 : 4,
                }}
            />

            {/* Red: UL to End */}
            {hasUL && (
                <Box 
                    bg="red.8"
                    style={{
                        position: 'absolute',
                        left: `${ulPct}%`,
                        width: `${100 - ulPct}%`,
                        height: '100%',
                        borderTopRightRadius: 4,
                        borderBottomRightRadius: 4,
                    }}
                />
            )}
        </Box>

        {/* Ticks & Labels */}

        {/* 0 Label */}
        {/* 0 Label */}
        <Text fz="xs" c="dimmed" style={{ position: 'absolute', left: 0, top: 34, lineHeight: 1 }}>0</Text>
        <Box style={{ position: 'absolute', left: 0, top: 18, height: barHeight + 6, width: 1,  background: '#000' }} />

        {/* RDA Tick & Label */}
        <Box 
            style={{ 
                position: 'absolute', 
                left: `${rdaPct}%`, 
                top: 18, 
                height: barHeight + 6, 
                width: 2, 
                background: '#000',
                transform: 'translateX(-50%)',
                zIndex: 2
            }} 
        />
        <Text 
            fz="xs" 
            c="dimmed" 
            fw={500}
            style={{ 
                position: 'absolute', 
                left: `${rdaPct}%`, 
                top: 34, 
                transform: 'translateX(-50%)', 
                lineHeight: 1,
                whiteSpace: 'nowrap' 
            }}
        >
            {rda.val} {rda.unit}
        </Text>

        {/* UL Tick & Label */}
        {hasUL && (
            <>
                <Box 
                    style={{ 
                        position: 'absolute', 
                        left: `${ulPct}%`, 
                        top: 12, 
                        height: barHeight + 6, 
                        width: 2, 
                        background: '#000',
                        transform: 'translateX(-50%)',
                        zIndex: 2
                    }} 
                />
                <Text 
                    fz="xs" 
                    c="dimmed" 
                    fw={500}
                    style={{ 
                        position: 'absolute', 
                        left: `${ulPct}%`, 
                        top: 0, 
                        transform: 'translateX(-50%)', 
                        lineHeight: 1,
                        whiteSpace: 'nowrap'
                    }}
                >
                    UL: {ul.val} {ul.unit}
                </Text>
            </>
        )}
    </Box>
  );
}
