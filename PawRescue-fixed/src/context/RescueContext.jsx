import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import * as reportService from '../services/reportService'
import * as rescueService from '../services/rescueService'

// Shared rescue case state. Loads reports from the API. Mutations go through
// the service layer; the returned records replace local copies so the UI mirrors the server.
export const RescueContext = createContext(null)

export function RescueProvider({ children }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setReports(await reportService.getReports())
    } catch (loadError) {
      setError(loadError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const upsertReport = useCallback((updated) => {
    setReports((current) => {
      const exists = current.some((report) => report.id === updated.id)
      return exists
        ? current.map((report) => (report.id === updated.id ? updated : report))
        : [updated, ...current]
    })
    return updated
  }, [])

  const createReport = useCallback(
    async (input, reporter) => upsertReport(await reportService.createReport(input, reporter)),
    [upsertReport],
  )

  const acceptCase = useCallback(
    async (reportId, volunteer) => upsertReport(await rescueService.acceptReport(reportId, volunteer)),
    [upsertReport],
  )

  const declineCase = useCallback(
    async (reportId, userId) => {
      await rescueService.declineReport(reportId, userId)
      setReports((current) => current.filter((report) => report.id !== reportId))
    },
    [],
  )

  const advanceCase = useCallback(
    async (reportId, nextStatus, actorName) =>
      upsertReport(await rescueService.updateRescueStatus(reportId, nextStatus, actorName)),
    [upsertReport],
  )

  const addCaseEvidence = useCallback(
    async (reportId, photoUrls, actorName) =>
      upsertReport(await rescueService.addEvidence(reportId, photoUrls, actorName)),
    [upsertReport],
  )

  const reassignCase = useCallback(
    async (reportId, assignee, actorName) =>
      upsertReport(await rescueService.reassignReport(reportId, assignee, actorName)),
    [upsertReport],
  )

  const value = useMemo(
    () => ({
      reports,
      loading,
      error,
      refresh,
      upsertReport,
      createReport,
      acceptCase,
      declineCase,
      advanceCase,
      addCaseEvidence,
      reassignCase,
    }),
    [reports, loading, error, refresh, upsertReport, createReport, acceptCase, declineCase, advanceCase, addCaseEvidence, reassignCase],
  )

  return <RescueContext.Provider value={value}>{children}</RescueContext.Provider>
}
