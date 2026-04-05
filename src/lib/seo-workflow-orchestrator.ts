/**
 * SEO Workflow Orchestrator
 * Vercel Workflow을 사용한 내구적(durable) SEO 자동화 오케스트레이션
 * 크래시 복구, 재시도, 장기 실행 작업 관리
 */

export interface WorkflowStep {
  stepId: string;
  name: string;
  action: string;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number; // exponential backoff base
  };
  timeout: number; // milliseconds
  dependencies: string[]; // stepIds that must complete first
}

export interface WorkflowExecution {
  executionId: string;
  workflowId: string;
  startTime: string;
  status: "pending" | "running" | "completed" | "failed" | "paused";
  steps: Array<{
    stepId: string;
    status: "pending" | "running" | "completed" | "failed";
    attempts: number;
    lastError?: string;
    completedAt?: string;
  }>;
  progress: number; // 0-100%
  estimatedTimeRemaining: number; // seconds
}

/**
 * Workflow Step 정의: 일일 순위 모니터링
 */
export function createDailyRankMonitoringWorkflow(): WorkflowStep[] {
  return [
    {
      stepId: "rank-check",
      name: "Daily Rank Check",
      action: "Query Google Search Console API for top 50 keywords",
      retryPolicy: {
        maxRetries: 3,
        backoffMs: 5000, // 5초 * 2^retryCount
      },
      timeout: 60000, // 1분
      dependencies: [],
    },
    {
      stepId: "anomaly-detection",
      name: "Detect Rank Changes",
      action: "Compare current ranks vs previous snapshot, identify ±3 changes",
      retryPolicy: {
        maxRetries: 2,
        backoffMs: 2000,
      },
      timeout: 30000, // 30초
      dependencies: ["rank-check"],
    },
    {
      stepId: "alert-generation",
      name: "Generate Alerts",
      action: "Create RankingChangeAlert for each anomaly, classify as critical/warning/info",
      retryPolicy: {
        maxRetries: 1,
        backoffMs: 1000,
      },
      timeout: 30000,
      dependencies: ["anomaly-detection"],
    },
    {
      stepId: "task-creation",
      name: "Create Automation Tasks",
      action: "Generate ContinuousOptimizationTask for each alert based on severity",
      retryPolicy: {
        maxRetries: 2,
        backoffMs: 2000,
      },
      timeout: 45000,
      dependencies: ["alert-generation"],
    },
    {
      stepId: "notification",
      name: "Send Notifications",
      action: "Alert critical issues via Slack/email, store all alerts in database",
      retryPolicy: {
        maxRetries: 3,
        backoffMs: 5000,
      },
      timeout: 30000,
      dependencies: ["task-creation"],
    },
  ];
}

/**
 * Workflow Step 정의: 자동 최적화 실행
 */
export function createAutoOptimizationWorkflow(): WorkflowStep[] {
  return [
    {
      stepId: "fetch-pending-tasks",
      name: "Fetch Pending Tasks",
      action: "Query database for pending tasks (status=pending), sorted by priority",
      retryPolicy: {
        maxRetries: 2,
        backoffMs: 3000,
      },
      timeout: 30000,
      dependencies: [],
    },
    {
      stepId: "validate-tasks",
      name: "Validate Tasks",
      action: "Check safety constraints: max 5 concurrent, max 10/day, no duplicate keywords",
      retryPolicy: {
        maxRetries: 1,
        backoffMs: 1000,
      },
      timeout: 20000,
      dependencies: ["fetch-pending-tasks"],
    },
    {
      stepId: "execute-content-update",
      name: "Execute Content Updates",
      action: "Run stale-content-update tasks: refresh timestamps, update summaries",
      retryPolicy: {
        maxRetries: 3,
        backoffMs: 5000,
      },
      timeout: 300000, // 5분 (콘텐츠 편집 시간)
      dependencies: ["validate-tasks"],
    },
    {
      stepId: "execute-link-boost",
      name: "Execute Link Boosting",
      action: "Run link-velocity-boost tasks: add internal links to orphaned pages",
      retryPolicy: {
        maxRetries: 3,
        backoffMs: 5000,
      },
      timeout: 300000,
      dependencies: ["validate-tasks"],
    },
    {
      stepId: "execute-semantic-expansion",
      name: "Execute Semantic Expansion",
      action: "Run semantic-expansion tasks: add long-tail keyword sections",
      retryPolicy: {
        maxRetries: 2,
        backoffMs: 4000,
      },
      timeout: 600000, // 10분
      dependencies: ["validate-tasks"],
    },
    {
      stepId: "measure-impact",
      name: "Measure Impact",
      action: "Wait 1 hour, then check Google Search Console for rank changes",
      retryPolicy: {
        maxRetries: 2,
        backoffMs: 3000,
      },
      timeout: 3900000, // 65분 (1시간 대기 + 버퍼)
      dependencies: ["execute-content-update", "execute-link-boost", "execute-semantic-expansion"],
    },
    {
      stepId: "record-results",
      name: "Record Results",
      action: "Store task results: before/after ranks, traffic impact, success rate",
      retryPolicy: {
        maxRetries: 2,
        backoffMs: 2000,
      },
      timeout: 60000,
      dependencies: ["measure-impact"],
    },
  ];
}

/**
 * Workflow 실행 추적
 */
export function trackWorkflowExecution(
  executionId: string,
  workflowSteps: WorkflowStep[],
  completedSteps: string[]
): WorkflowExecution {
  const progress = Math.round((completedSteps.length / workflowSteps.length) * 100);

  // 평균 스텝 시간 추정
  const avgStepDuration = 120; // 초
  const remainingSteps = workflowSteps.length - completedSteps.length;
  const estimatedTimeRemaining = remainingSteps * avgStepDuration;

  return {
    executionId,
    workflowId: "seo-automation",
    startTime: new Date().toISOString(),
    status: progress === 100 ? "completed" : "running",
    steps: workflowSteps.map((step) => ({
      stepId: step.stepId,
      status: completedSteps.includes(step.stepId) ? "completed" : "pending",
      attempts: completedSteps.includes(step.stepId) ? 1 : 0,
      completedAt: completedSteps.includes(step.stepId) ? new Date().toISOString() : undefined,
    })),
    progress,
    estimatedTimeRemaining,
  };
}

/**
 * Retry 로직 with exponential backoff
 */
export function calculateBackoffDelay(attempt: number, baseDelayMs: number): number {
  // exponential backoff: baseDelay * 2^attempt
  const delay = baseDelayMs * Math.pow(2, attempt);
  // jitter 추가: ±20%
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.max(1000, delay + jitter); // 최소 1초
}

/**
 * 내구적(Durable) 자동화 워크플로우 정의
 * Vercel Workflow로 자동 실행되는 장기 실행 작업
 */
export function defineAutomationWorkflows(): {
  schedule: string;
  dailyMonitoring: string;
  autoOptimization: string;
  recoveryPolicy: string[];
} {
  return {
    // 매일 00:00 UTC에 실행
    schedule: "0 0 * * *",

    // 일일 모니터링 워크플로우
    dailyMonitoring: `
      1. Query Google Search Console API (retry: 3x, backoff: 5s)
      2. Detect rank anomalies ±3 positions (retry: 2x, backoff: 2s)
      3. Classify alerts: critical/warning/info (retry: 1x)
      4. Generate automation tasks based on severity
      5. Send Slack alerts for critical issues
      6. Store all alerts + tasks in durable storage

      Timeout per workflow: 5 minutes (with retry logic)
      Failure handling: Automatic retry, then escalate to admin
    `,

    // 자동 최적화 워크플로우
    autoOptimization: `
      1. Fetch pending tasks from queue (sorted by priority)
      2. Validate safety constraints: max 5 concurrent, max 10/day
      3. Execute tasks in parallel (with rate limiting):
         - Content updates (30min timeout, retry 3x)
         - Link boosting (30min timeout, retry 3x)
         - Semantic expansion (10min timeout, retry 2x)
      4. Wait 1 hour for Google to recrawl/index
      5. Check ranks again via GSC API
      6. Record before/after metrics
      7. Trigger next round of optimizations if needed

      Durability: All steps persisted to DB, resumable on crash
      Failure handling: Exponential backoff, max 3 retries, then pause for manual review
    `,

    // 크래시 복구 정책
    recoveryPolicy: [
      "✅ Durable state storage: All workflow state → database (not memory)",
      "🔄 Automatic resume: Crash 후 마지막 완료 스텝부터 재시작",
      "📊 Idempotent operations: 같은 스텝 재실행 해도 중복 안 됨 (idempotency key 사용)",
      "⏱️ Timeout handling: 스텝이 timeout되면 자동 retry (exponential backoff)",
      "🛑 Circuit breaker: 3회 연속 실패 → 해당 작업 일시 중지 (수동 검토 대기)",
      "📧 Escalation: Critical 실패 → 관리자 알림 (이메일)",
      "🧹 Cleanup: 72시간 이상 pending 상태 → 자동 취소",
    ],
  };
}

/**
 * 자동화 효과 측정
 */
export function measureAutomationROI(
  executionMetrics: {
    tasksExecuted: number;
    averageRankImprovement: number;
    averageTrafficGain: number;
    averageTimeToResponse: string;
  },
  costMetrics: {
    costPerTask: number; // $ (API 호출, 컴퓨팅)
    manualTaskCost: number; // $ (에이전시 / 시간)
  }
): {
  automationROI: string;
  savings: string;
  breakEvenPoint: string;
  recommendation: string;
} {
  const totalAutomationCost = executionMetrics.tasksExecuted * costMetrics.costPerTask;
  const manualCost = executionMetrics.tasksExecuted * costMetrics.manualTaskCost;
  const savings = manualCost - totalAutomationCost;
  const roi = (savings / totalAutomationCost) * 100;

  const averageTaskCost = costMetrics.costPerTask;
  const breakEvenTasks = Math.ceil(averageTaskCost / (costMetrics.manualTaskCost - averageTaskCost));

  return {
    automationROI: `${roi.toFixed(0)}% (${executionMetrics.tasksExecuted}개 작업 기준)`,
    savings: `$${savings.toFixed(2)} (${executionMetrics.tasksExecuted}개 작업 자동화)`,
    breakEvenPoint: `${breakEvenTasks}개 작업 (약 ${Math.ceil(breakEvenTasks / 7)}주)`,
    recommendation:
      roi > 300
        ? "✅ HIGHLY PROFITABLE: 계속 확대"
        : roi > 100
          ? "✅ PROFITABLE: 현재 수준 유지"
          : "⚠️ MARGINAL: 비용 최적화 필요",
  };
}
