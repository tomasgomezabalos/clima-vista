#!/usr/bin/env bash
# Hook Stop con dos fases, una por turno de bloqueo y en este orden:
#   1. Tests: hay cambios en código de producción de src/ cuyo test espejo no
#      ha cambiado -> pide lanzar el subagente react-ts-test-writer.
#   2. Revisión: hay cambios nuevos sin revisar en src/ o tests/ -> pide lanzar
#      el subagente react-ts-code-reviewer.
# Cada fase guarda un hash en disco para no repetirse ni entrar en bucle.
set -uo pipefail

cat >/dev/null # el JSON de entrada del hook no se usa

# El primer `git` del PATH puede no ser ejecutable en esta máquina (binario de
# otra arquitectura), así que se usa el primero que funcione de verdad.
GIT=""
for candidate in git /usr/bin/git /opt/homebrew/bin/git; do
  if "$candidate" --version >/dev/null 2>&1; then
    GIT="$candidate"
    break
  fi
done
[ -n "$GIT" ] || exit 0

root="$("$GIT" rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$root" || exit 0

tests_state=".claude/.tests-last-hash"
review_state=".claude/.review-last-hash"

# Sin jq (puede no ser ejecutable aquí): se retiran las comillas y las barras
# invertidas de la razón para que el JSON resultante sea siempre válido.
emit_block() {
  local reason="$1"
  reason="${reason//\\/}"
  reason="${reason//\"/}"
  printf '{"decision":"block","reason":"%s"}\n' "$reason"
}

# Archivos .ts/.tsx cambiados (modificados y nuevos) en src/ y tests/.
changed="$(
  {
    "$GIT" diff HEAD --name-only -- src tests
    "$GIT" ls-files --others --exclude-standard -- src tests
  } | grep -E '\.(ts|tsx)$' | sort -u
)"

[ -n "$changed" ] || exit 0

hash_of_files() {
  # Hash del contenido actual de los archivos indicados (uno por línea).
  while read -r f; do
    [ -n "$f" ] || continue
    printf '%s\n' "$f"
    cat "$f" 2>/dev/null
  done | shasum -a 256 | cut -d' ' -f1
}

# --- Fase 1: tests de código de producción cambiado ---------------------------
needs_tests=""
while read -r f; do
  case "$f" in
    src/*) ;;
    *) continue ;;
  esac
  case "$f" in
    */types.ts | *.d.ts) continue ;;
  esac

  base="tests/${f#src/}"
  base="${base%.*}"
  if printf '%s\n' "$changed" | grep -qxF -e "$base.test.ts" -e "$base.test.tsx"; then
    continue
  fi
  needs_tests="${needs_tests}${f} "
done <<EOF
$changed
EOF

if [ -n "$needs_tests" ]; then
  tests_hash="$(printf '%s' "$needs_tests" | tr ' ' '\n' | sort | hash_of_files)"
  if ! { [ -f "$tests_state" ] && [ "$(cat "$tests_state")" = "$tests_hash" ]; }; then
    printf '%s\n' "$tests_hash" >"$tests_state"
    emit_block "Hay cambios en código de producción sin cambios en sus tests: ${needs_tests% }. Antes de terminar, usa la herramienta Agent con subagent_type react-ts-test-writer para comprobar si los tests existentes ya cubren el comportamiento nuevo o modificado y añadir o ajustar solo los que falten, únicamente en tests/ y sin tocar código de producción. Si ya está cubierto, dilo y no añadas nada. Después se te pedirá la revisión de código."
    exit 0
  fi
fi

# --- Fase 2: revisión de código ----------------------------------------------
review_hash="$(
  {
    "$GIT" diff HEAD -- src tests
    "$GIT" ls-files --others --exclude-standard -- src tests | sort | hash_of_files
  } | shasum -a 256 | cut -d' ' -f1
)"

if [ -f "$review_state" ] && [ "$(cat "$review_state")" = "$review_hash" ]; then
  exit 0
fi

printf '%s\n' "$review_hash" >"$review_state"

files="$(printf '%s' "$changed" | tr '\n' ' ')"
emit_block "Hay cambios de código sin revisar en: ${files}. Antes de terminar, usa la herramienta Agent con subagent_type react-ts-code-reviewer para revisar solo esos cambios (git diff HEAD y archivos nuevos), en modo solo lectura. Resume sus hallazgos por severidad. No apliques correcciones sin que el usuario lo pida."
