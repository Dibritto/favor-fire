
"use client";

import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type FormatFunction = 'format' | 'formatDistanceToNow';

interface ClientFormattedDateProps {
  dateString: string;
  formatString: string;
  formatFunction?: FormatFunction;
  addSuffix?: boolean;
}

export function ClientFormattedDate({ dateString, formatString, formatFunction = 'format', addSuffix = false }: ClientFormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This effect runs only on the client, after hydration.
    try {
        const date = new Date(dateString);
        let result: string;
        if (formatFunction === 'formatDistanceToNow') {
            result = formatDistanceToNow(date, { locale: ptBR, addSuffix });
        } else {
            result = format(date, formatString, { locale: ptBR });
        }
        setFormattedDate(result);
    } catch (error) {
        console.error("Error formatting date:", error);
        setFormattedDate(dateString); // fallback to original string on error
    }
  }, [dateString, formatString, formatFunction, addSuffix]);

  // Render a placeholder or nothing on the server and initial client render.
  // This prevents the hydration mismatch.
  if (!formattedDate) {
    return null;
  }

  return <>{formattedDate}</>;
}
