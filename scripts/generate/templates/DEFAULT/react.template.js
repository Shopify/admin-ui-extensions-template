import React, {useMemo} from 'react';
import {
  Button,
  Text,
  Stack,
  extend,
  render,
  useLocale,
} from '@shopify/admin-ui-extensions-react';

const translations = {
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

function Extension() {
  const translate = useTranslate(translations);

  return (
    <>
      <Stack vertical>
        <Text>{translate('hello')}</Text>
        <Button
          title={translate('clickMe')}
          primary
          onPress={() => console.log('Button clicked!')}
        />
      </Stack>
    </>
  );
}

extend(
  // Add your extension point here
  'Playground',
  render(() => <Extension />)
);
