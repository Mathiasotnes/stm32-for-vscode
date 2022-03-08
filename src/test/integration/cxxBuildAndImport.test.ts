import * as vscode from 'vscode';

import { afterEach, beforeEach, suite, test } from 'mocha';

import buildSTM from '../../BuildTask';
import {
  addTestToolSettingsToWorkspace,
  waitForWorkspaceFoldersChange,
  cleanUpSTM32ForVSCodeArtifacts
} from '../helpers';
import importAndSetupCubeIDEProject from '../../import';
import { readConfigFile, writeConfigFile } from '../../configuration/stm32Config';


suite('import and convert to C++ test', () => {
  afterEach(() => {
    cleanUpSTM32ForVSCodeArtifacts();
  });
  beforeEach(async () => {
    // wait for the folder to be loaded
    if (!vscode.workspace.workspaceFolders || !vscode.workspace.workspaceFolders?.[0]) {
      await waitForWorkspaceFoldersChange(2000);
    }
    await addTestToolSettingsToWorkspace();
  });

  test('Import Cube project convert to C++ and build', async () => {
    await importAndSetupCubeIDEProject();

    // change the config to c++
    const projectConfiguration = await readConfigFile();
    projectConfiguration.language = 'C++';
    await writeConfigFile(projectConfiguration);
    await buildSTM();
  }).timeout(120000);
});