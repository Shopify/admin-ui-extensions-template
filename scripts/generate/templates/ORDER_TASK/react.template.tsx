import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  Button,
  Text,
  Stack,
  extend,
  render,
  useLocale,
  useData,
  Link,
} from '@shopify/admin-ui-extensions-react';

interface Translations {
  [key: string]: string;
}

const translations: {
  [locale: string]: Translations;
} = {
  de: {
    hello: 'Guten Tag',
    clickMe: 'Klick mich',
  },
  en: {
    hello: 'Hello',
    clickMe: 'Click Me',
  },
  fr: {
    hello: 'Bonjour',
    clickMe: 'clique moi',
  },
};

function useTranslate(translationsForAllLocales) {
  const locale = useLocale();
  const translationsByLocale = useMemo(
    () => translationsForAllLocales[locale] || translationsForAllLocales.en,
    [locale, translationsForAllLocales]
  );
  return (key) => translationsByLocale[key];
}

function OrderTaskExtension() {
  const {initialData, onTypeSelection, onTaskComplete} =
    useData<'Admin::OrderWorkspaces::OrderTask'>();
  const [iData, setIData] = useState([]);

  const taskData = async () => {
    const typeData = await onTypeSelection('Fullfilment');
    console.log(typeData);
    setIData(typeData);
  };

  if (!iData.length) {
    taskData();
  }
  return (
    <Stack vertical>
      <Text>{iData.length}</Text>
      <Link onPress={onTaskComplete}>
        <Text> Mark as fulfilled </Text>
      </Link>
      <Text>{initialData}</Text>
    </Stack>
  );
}

extend(
  'Admin::OrderWorkspaces::OrderTask',
  render(() => <OrderTaskExtension />)
);