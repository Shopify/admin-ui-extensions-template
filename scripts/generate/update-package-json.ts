import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

import {Template} from './generate-src';

export function addScripts({
  entry,
  type = 'DEFAULT',
}: {
  entry: string;
  type: string;
}) {
  return updatePackage((npmPackage) => {
    npmPackage.scripts.server = ` admin-ui-extensions-run server --entry="${entry}" --type=${type}`;
    npmPackage.scripts.build = `admin-ui-extensions-run build --entry="${entry}"`;
    return npmPackage;
  });
}

export function cleanUpInitialize({template}: {template: Template}) {
  const isTypescript = [Template.Typescript, Template.TypescriptReact].includes(
    template
  );
  const isReact = [Template.JavascriptReact, Template.TypescriptReact].includes(
    template
  );

  return updatePackage((npmPackage) => {
    npmPackage.scripts.generate = undefined;
    npmPackage.scripts['type-check'] = undefined;
    npmPackage.scripts.format = undefined;
    npmPackage.scripts.lint = undefined;

    npmPackage.prettier = undefined;

    const {devDependencies} = npmPackage;

    npmPackage.devDependencies = {
      '@shopify/admin-ui-extensions-cli': devDependencies['@shopify/admin-ui-extensions-cli'],
      typescript: isTypescript ? devDependencies.typescript : undefined,
    };

    if (isReact) {
      npmPackage.dependencies['@shopify/admin-ui-extensions'] = undefined;
    } else {
      npmPackage.dependencies.react = undefined;
      npmPackage.dependencies['@shopify/admin-ui-extensions-react'] = undefined;
    }

    return npmPackage;
  });
}

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function updatePackage(updateFn: (npmPackage: any) => any) {
  const npmPackageFile = path.resolve('.', 'package.json');
  const npmPackageJson = (await readFile(npmPackageFile)).toString();

  const npmPackage = updateFn(JSON.parse(npmPackageJson));

  const npmPackageJsonWithScripts = JSON.stringify(npmPackage, null, '  ');
  await writeFile(npmPackageFile, npmPackageJsonWithScripts);
}
