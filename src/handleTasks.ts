
import { ShellExecution, Task, tasks, workspace, TaskProcessEndEvent } from 'vscode';



/**
 *
 * @param type type of process to execute e.g. build
 * @param name The name of the process to execute
 * @param cmd The command to execute within a shell.
 */
export default function executeTask(
  type: string, name: string, cmd: string, cwd?: string): Promise<void | number> {
  return new Promise((resolve, reject) => {
    const processExec = new ShellExecution(cmd, cwd ? { cwd } : {});
    if (!workspace.workspaceFolders) { throw Error('no workspace folder is selected'); }
    const proccessTask = new Task(
      {
        type,
      },
      workspace.workspaceFolders[0], name, 'STM32 for VSCode', processExec);
    tasks.executeTask(proccessTask);
    tasks.onDidEndTaskProcess((e: TaskProcessEndEvent) => {
      // console.log('onDidEndTask event');
      // console.log(e.execution.task);
      // console.log(e.exitCode);
      if (e.execution.task.name === name) {
        if (e.exitCode === 0) {
          resolve();
        } else {
          reject(e.exitCode);
        }
      }
    });
  });
}
