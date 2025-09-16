'use client';

import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Layout from './Layout';

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SuspenseBoundary({ 
  children, 
  fallback 
}: SuspenseBoundaryProps) {
  const defaultFallback = (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    </Layout>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}
