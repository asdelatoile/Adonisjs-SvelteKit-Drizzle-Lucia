import { execa } from 'execa'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class KyselyGenerate extends BaseCommand {
  static commandName = 'kysely:generate'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Start of generation...')
    const { stdout } = await execa(
      'npx',
      ['kysely-codegen', '--camel-case', '--out-file', 'database/types.ts'],
      {
        env: {
          FORCE_COLOR: '1',
        },
      }
    )
    this.logger.log(stdout)
  }
}
