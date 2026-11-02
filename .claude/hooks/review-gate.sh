#!/usr/bin/env bash
# Hook Stop: pide a Claude que lance el subagente react-ts-code-reviewer cuando
# hay cambios nuevos sin revisar en src/ o tests/ (*.ts, *.tsx).
# Un hash del diff guardado en disco evita repetir la revisión y los bucles.
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

state_file=".claude/.review-last-hash"

changed="$(
  {
    "$GIT" diff HEAD --name-only -- src tests
    "$GIT" ls-files --others --exclude-standard -- src tests
  } | grep -E '\.(ts|tsx)$' | sort -u
)"

[ -n "$changed" ] || exit 0

hash="$(
  {
    "$GIT" diff HEAD -- src tests
    "$GIT" ls-files --others --exclude-standard -- src tests | sort | while read -r f; do
      printf '%s\n' "$f"
      cat "$f"
    done
  } | shasum -a 256 | cut -d' ' -f1
)"

if [ -f "$state_file" ] && [ "$(cat "$state_file")" = "$hash" ]; then
  exit 0
fi

printf '%s\n' "$hash" >"$state_file"

files="$(printf '%s' "$changed" | tr '\n' ' ')"
reason="Hay cambios de código sin revisar en: ${files}. Antes de terminar, usa la herramienta Agent con subagent_type react-ts-code-reviewer para revisar solo esos cambios (git diff HEAD y archivos nuevos), en modo solo lectura. Resume sus hallazgos por severidad. No apliques correcciones sin que el usuario lo pida."

# Sin jq (puede no ser ejecutable aquí): se retiran las comillas y las barras
# invertidas de la razón para que el JSON resultante sea siempre válido.
reason="${reason//\\/}"
reason="${reason//\"/}"
printf '{"decision":"block","reason":"%s"}\n' "$reason"
