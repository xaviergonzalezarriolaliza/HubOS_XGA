// Safe artifact cleanup script
// Deletes artifacts older than `THRESHOLD_DAYS` using `gh api`.
// Usage: run from repo root where `gh` is authenticated.

const fs = require('fs');
const { execSync } = require('child_process');

const OWNER = 'xaviergonzalezarriolaliza';
const REPO = 'HubOS_XGA';
const THRESHOLD_DAYS = 7; // change if you want a different cutoff

const artifactsFile = 'artifacts.json';
if (!fs.existsSync(artifactsFile)) {
  console.error(`${artifactsFile} not found. Run:\n  gh api repos/${OWNER}/${REPO}/actions/artifacts?per_page=100 --jq '.artifacts' > ${artifactsFile}`);
  process.exit(1);
}

const artifacts = JSON.parse(fs.readFileSync(artifactsFile, 'utf8'));
const cutoff = Date.now() - THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

let deleted = 0;
for (const a of artifacts) {
  const created = new Date(a.created_at).getTime();
  if (created < cutoff) {
    const id = a.id;
    try {
      console.log(`Deleting artifact ${id} (${a.name}) created ${a.created_at}`);
      execSync(`gh api --method DELETE /repos/${OWNER}/${REPO}/actions/artifacts/${id}`, { stdio: 'inherit' });
      deleted++;
    } catch (e) {
      console.error(`Failed to delete artifact ${id}: ${e.message}`);
    }
  }
}

console.log(`Done. Deleted ${deleted} artifacts older than ${THRESHOLD_DAYS} days.`);
