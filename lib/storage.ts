import { promises as fs } from "fs";
import path from "path";

type SeenState = {
  [feedUrl: string]: string | undefined;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const STATE_FILE = path.join(DATA_DIR, "seen.json");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

async function readState(): Promise<SeenState> {
  try {
    await ensureDataDir();
    const content = await fs.readFile(STATE_FILE, "utf8");
    return JSON.parse(content) as SeenState;
  } catch {
    return {} as SeenState;
  }
}

async function writeState(state: SeenState): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

export async function getLastSeenId(feedUrl: string): Promise<string | undefined> {
  const state = await readState();
  return state[feedUrl];
}

export async function setLastSeenId(feedUrl: string, id: string): Promise<void> {
  const state = await readState();
  state[feedUrl] = id;
  await writeState(state);
}


