/**
 * Bot simple de diagnóstico automático (taller 2).
 * Sugiere una causa probable según palabras clave del incidente.
 */
function suggestCause(title = "", description = "", severity = "medium") {
  const text = `${title} ${description}`.toLowerCase();

  const rules = [
    {
      keywords: ["cpu", "satur", "alto uso", "100%"],
      cause:
        "Posible saturación de CPU. Revisar procesos pesados y escalar horizontalmente si es necesario.",
    },
    {
      keywords: ["memoria", "memory", "oom", "ram"],
      cause:
        "Posible fuga o agotamiento de memoria. Revisar heap, contenedores y límites de RAM.",
    },
    {
      keywords: ["latencia", "lento", "timeout", "timeout", "2s", "demora"],
      cause:
        "Posible saturación de CPU o consultas lentas a la base de datos. Revisar métricas de CPU y queries lentas.",
    },
    {
      keywords: ["db", "base de datos", "sql", "postgres", "mysql", "query"],
      cause:
        "Posible cuello de botella en base de datos. Revisar índices, conexiones y queries lentas.",
    },
    {
      keywords: ["auth", "token", "jwt", "login", "401", "403"],
      cause:
        "Posible fallo de autenticación/autorización. Revisar expiración de tokens y políticas de acceso.",
    },
    {
      keywords: ["deploy", "despliegue", "release", "versión"],
      cause:
        "Posible regresión tras un despliegue. Revisar el último release y considerar rollback.",
    },
    {
      keywords: ["red", "network", "dns", "conexión", "unreachable"],
      cause:
        "Posible problema de red o DNS. Revisar conectividad entre servicios y balanceadores.",
    },
    {
      keywords: ["error", "500", "crash", "exception"],
      cause:
        "Posible excepción no controlada en el servicio. Revisar logs de aplicación y última suite de tests.",
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return rule.cause;
    }
  }

  if (severity === "critical" || severity === "high") {
    return "Incidente de alta severidad sin patrón claro. Priorizar revisión de métricas (CPU, latencia, errores/min) y logs recientes.";
  }

  return "Sin patrón claro detectado. Ejecutar tests automatizados y revisar el dashboard de monitoreo para correlacionar métricas.";
}

module.exports = { suggestCause };