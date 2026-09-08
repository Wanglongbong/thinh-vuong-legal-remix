'use client';

import { useEffect, useState } from 'react';
import { safeStorage } from '@/lib/storage';

const customerNameKey = 'tv-legal-customer-name';
const customerNameEvent = 'tv:customer-name';

function normalizeName(value: string) {
  return value.replace(/\s+/g, ' ').trim().slice(0, 60);
}

export function useCustomerName() {
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      setName(normalizeName(safeStorage.getItem(customerNameKey) || ''));
      setReady(true);
    };
    const sync = (event: Event) =>
      setName(normalizeName((event as CustomEvent<string>).detail || ''));
    read();
    window.addEventListener(customerNameEvent, sync);
    return () => window.removeEventListener(customerNameEvent, sync);
  }, []);

  function remember(value: string) {
    const normalized = normalizeName(value);
    if (!normalized) return false;
    safeStorage.setItem(customerNameKey, normalized);
    setName(normalized);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(customerNameEvent, { detail: normalized }),
      );
    }
    return true;
  }

  function forget() {
    safeStorage.removeItem(customerNameKey);
    setName('');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(customerNameEvent, { detail: '' }));
    }
  }

  return { name, ready, remember, forget };
}
