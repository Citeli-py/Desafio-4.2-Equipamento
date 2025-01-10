@echo off

xcopy /E /Y ".\*" "C:\Program Files\nginx-1.24.0\html\dev\turma-node-grupo-4-equipamento\" && cd "C:\Program Files\nginx-1.24.0\html\dev\turma-node-grupo-4-equipamento\" && npm ci && npm run start:prod

exit /b 0