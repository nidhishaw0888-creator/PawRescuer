const EMERGENCY_PRIORITY = {
  Critical: ['Injured', 'Abused', 'Trapped'],
  High: ['Endangered', 'Abandoned'],
  Normal: ['Other'],
}

export function suggestPriority(severity, emergencyType) {
  if (severity === 'Critical') return { priority: 'Critical', reason: 'Severity marked as Critical.' }
  if (EMERGENCY_PRIORITY.Critical.includes(emergencyType)) {
    return { priority: 'Critical', reason: `${emergencyType} emergencies are treated as critical.` }
  }
  if (severity === 'High' || EMERGENCY_PRIORITY.High.includes(emergencyType)) {
    return { priority: 'High', reason: `Severity ${severity} and emergency type ${emergencyType}.` }
  }
  return { priority: 'Normal', reason: 'Normal severity and non-critical emergency type.' }
}
