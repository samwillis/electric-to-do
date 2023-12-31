import fs from 'fs';
import path from 'path';
import parseArgs from 'minimist';
import shell from 'shelljs';
import * as url from 'url';

import createPool from '@databases/pg';
import { sql } from '@databases/pg';

// The __dirname variable is not available in ES modules.
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// If we are running the docker compose file
// there will be a compose-postgres-1 container running
// which binds the container's 5432 port used by PG
// to some available port on the host machine.
// So we fetch this host port and use it in the default url.
const pgPort = fetchHostPortPG() ?? 5432
const appName = fetchAppName() ?? 'electric'
const DEFAULT_URL = `postgresql://postgres:password@localhost:${pgPort}/${appName}`
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_URL
const MIGRATIONS_DIR = process.env.MIGRATIONS_DIR || path.resolve(__dirname, 'migrations')

const argv = parseArgs(process.argv.slice(2))
const targetFile = argv.file

if (!process.env.DATABASE_URL) {
  console.info(`Connecting to Postgres via host port ${pgPort}`)
}

const db = createPool(DATABASE_URL)

const apply = async (fileName) => {
  const filePath = path.join(MIGRATIONS_DIR, fileName)
  console.log('apply', filePath)

  await db.tx(
    (tx) => tx.query(
      sql.file(filePath)
    )
  )
}

const main = async () => {
  if (targetFile !== undefined) {
    await apply(targetFile)
  }
  else {
    const fileNames = fs.readdirSync(MIGRATIONS_DIR)
    for (const file of fileNames) {
      await apply(file)  
    }
  }
}

try {
  main()
}
catch (err) {
  console.error(err)
  process.exitCode = 1
}
finally {
  db.dispose()
}

function fetchHostPortPG() {
  return fetchHostPort('compose-postgres-1', 5432)
}

// Returns the host port to which the `containerPort` of the `container` is bound.
// Returns undefined if the port is not bound or container does not exist.
function fetchHostPort(container, containerPort) {
  const output = shell.exec(`docker inspect --format='{{(index (index .NetworkSettings.Ports "${containerPort}/tcp") 0).HostPort}}' ${container}`)
  const port = parseInt(output)
  if (!isNaN(port)) {
    return port
  }
}

// Reads the app name from the backend/.envrc file
function fetchAppName() {
  const envrcFile = path.join(__dirname, '..', 'backend', 'compose', '.envrc')
  const envrc = fs.readFileSync(envrcFile, 'utf8')

  let appName = undefined

  envrc
  .split(/\r?\n/) // split lines
  .reverse() // in case the app name would be defined several times
  .find(line => {
    const match = line.match(/^(export APP_NAME=)(.*)/)
    if (match) {
      appName = match[2]
      return true
    }
    return false
  })

  return appName
}
