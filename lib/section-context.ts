"use client";

import React from 'react';

export const SectionContext = React.createContext<{
  sectionId: string;
  isActive: boolean;
}>({
  sectionId: '',
  isActive: false,
});
