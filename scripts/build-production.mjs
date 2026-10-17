import { spawnSync } from 'node:child_process';
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this script with npm run build:production.');
const result = spawnSync(process.execPath, [npmCli, 'run', 'build'], {
 stdio: 'inherit',
 env: { ...process.env, PUBLIC_SITE_MODE: 'production' }
});
process.exit(result.status ?? 1);
