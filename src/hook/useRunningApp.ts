const runningQueue = new Map<string, any>()

export const useRunningApp = (appId: string, value?: any) => {
  if (!runningQueue.has(appId)) {
    runningQueue.set(appId, value)
  }

  return runningQueue.get(appId)
}
