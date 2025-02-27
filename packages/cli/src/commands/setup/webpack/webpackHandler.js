import path from 'path'

import fs from 'fs-extra'
import { Listr } from 'listr2'

import { errorTelemetry } from '@redwoodjs/telemetry'

import { getPaths, writeFile } from '../../../lib'
import c from '../../../lib/colors'

export const handler = async ({ force }) => {
  const tasks = new Listr(
    [
      {
        title: 'Adding webpack file to your web folder...',
        task: () => {
          const webpackConfigFile = `${getPaths().web.config}/webpack.config.js`

          return writeFile(
            webpackConfigFile,
            fs
              .readFileSync(
                path.resolve(
                  __dirname,
                  'templates',
                  'webpack.config.js.template',
                ),
              )
              .toString(),
            { overwriteExisting: force },
          )
        },
      },
      {
        title: 'One more thing...',
        task: (_ctx, task) => {
          task.title = `One more thing...\n
          ${c.tip(
            'Quick link to the docs on configuring custom webpack config:',
          )}
          ${c.link(
            'https://redwoodjs.com/docs/webpack-configuration#configuring-webpack',
          )}
        `
        },
      },
    ],
    { rendererOptions: { collapseSubtasks: false } },
  )

  try {
    await tasks.run()
  } catch (e) {
    errorTelemetry(process.argv, e.message)
    console.error(c.error(e.message))
    process.exit(e?.exitCode || 1)
  }
}
