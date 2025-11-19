/* ============================================================================
   OSOMAGIC — MOTOR DE SNAPSHOTS (Mini-historial interno)
   ============================================================================ */

const MAX_SNAPSHOTS = 12;

let snapshots = []; // [{ id, timestamp, tree }]


/* ============================================================================
   CREA UN SNAPSHOT (siempre antes de aplicar un patch o cambio IA)
   ============================================================================ */
export function createSnapshot(tree) {
  const snap = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    tree: structuredClone(tree)
  };

  snapshots.push(snap);

  // Limitar tamaño del historial
  if (snapshots.length > MAX_SNAPSHOTS) {
    snapshots.shift();
  }

  return snap.id;
}


/* ============================================================================
   OBTENER EL SNAPSHOT MÁS RECIENTE
   ============================================================================ */
export function getLastSnapshot() {
  if (snapshots.length === 0) return null;
  return snapshots[snapshots.length - 1];
}


/* ============================================================================
   RESTAURAR AL ÚLTIMO SNAPSHOT ESTABLE
   ============================================================================ */
export function restoreLastSnapshot() {
  const last = getLastSnapshot();
  if (!last) return null;
  return structuredClone(last.tree);
}


/* ============================================================================
   BORRAR TODOS LOS SNAPSHOTS (ej: nuevo proyecto)
   ============================================================================ */
export function resetSnapshots() {
  snapshots = [];
}


/* ============================================================================
   DEBUG — VER EL HISTORIAL
   ============================================================================ */
export function getSnapshotsInfo() {
  return snapshots.map((s) => ({
    id: s.id,
    time: new Date(s.timestamp).toLocaleString(),
  }));
}
