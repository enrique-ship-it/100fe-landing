# Next Steps — Post-Launch

**Contexto:** la landing ya está publicada y operativa en producción.

## 1) Cierre de Repositorio (Hoy)

- Revisar cambios pendientes: `git status`
- Commit final de cierre
- Push a `main`
- Confirmar que Vercel tome el último commit

### Commit sugerido

```bash
git add .
git commit -m "chore(closeout): limpieza final de repo y actualización de estado"
git push origin main
```

## 2) Verificación de Producción (Hoy)

- URL: https://100fe-landing.vercel.app
- Revisar desktop + mobile
- Confirmar CTA abre checkout Hotmart
- Confirmar links legales funcionales

## 3) Tracking QA (Esta semana)

- Meta Pixel Helper:
  - `ViewContent` en page load
  - `AddToCart` en clic de CTA
- GA4 Realtime:
  - `page_view`
  - `begin_checkout`
  - `scroll`

## 4) Operación de Ads (Siguiente paso)

- Crear campaña Meta Ads con objetivo de conversiones
- Usar URL de producción
- Definir presupuesto inicial y KPI base (CTR, CPC, CPA, ROAS)

## 5) Mantenimiento Ligero

- Revisión semanal de conversiones
- Ajustes de copy/creativos según resultados
- Mantener documentación al día cuando haya cambios funcionales
