
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientFormattedDateProps {
  dateString: string;
  format: string;
}

export function ClientFormattedDate({ dateString, format: formatString }: ClientFormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This effect runs only on the client, after hydration.
    setFormattedDate(format(new Date(dateString), formatString, { locale: ptBR }));
  }, [dateString, formatString]);

  // Render a placeholder or nothing on the server and initial client render.
  // This prevents the hydration mismatch.
  if (!formattedDate) {
    return null;
  }

  return <>{formattedDate}</>;
}
