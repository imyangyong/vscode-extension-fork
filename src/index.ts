import type { ExtensionContext } from 'vscode'
import { exec } from 'node:child_process'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, window, workspace } from 'vscode'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // eslint-disable-next-line no-console
  console.log('Congratulations, your extension "fork" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = commands.registerCommand('fork.open', () => {
    // The code you place here will be executed every time your command is executed

    // https://stackoverflow.com/questions/39569993/vs-code-extension-get-full-path
    let rootPath: string = ''
    const activeEditor = window.activeTextEditor

    if (activeEditor) {
      // Get the workspace folder for the currently active file
      const workspaceFolder = workspace.getWorkspaceFolder(activeEditor.document.uri)
      if (workspaceFolder) {
        rootPath = workspaceFolder.uri.path
      }
      else {
        window.showErrorMessage('Fork error: Active file is not in a workspace folder')
        return
      }
    }
    else if (workspace.workspaceFolders !== undefined) {
      rootPath = workspace.workspaceFolders[0].uri.path
    }
    else {
      window.showErrorMessage('Fork error: Working folder not found, open a folder an try again')
      return
    }
    exec(`open -a fork ${rootPath}`, (err: any, _stdout: any, _stderr: any) => {
      if (err) {
        window.showErrorMessage(`Fork error: ${err}`)
      }
    })
  })

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export async function deactivate() {}
