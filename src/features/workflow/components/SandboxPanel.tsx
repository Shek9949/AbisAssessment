import type { SimulationResult, ValidationResult } from '../types.ts'

interface SandboxPanelProps {
  validation: ValidationResult
  simulation: SimulationResult | null
  isSimulating: boolean
  onSimulate: () => void
}

export function SandboxPanel({
  validation,
  simulation,
  isSimulating,
  onSimulate,
}: SandboxPanelProps) {
  return (
    <section className="wf-sandbox">
      <header className="wf-sandbox-head">
        <div>
          <h2>Sandbox</h2>
        </div>
        <button type="button" onClick={onSimulate} disabled={isSimulating}>
          {isSimulating ? 'Running...' : 'Run'}
        </button>
      </header>

      <div className="wf-sandbox-body">
        <div className="wf-validation-box">
          <h3>Structure validation</h3>
          {validation.isValid ? (
            <p className="wf-ok">Workflow is valid.</p>
          ) : (
            <ul>
              {validation.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="wf-simulation-box">
          <h3>Execution log</h3>
          {!simulation && <p className="wf-muted">Run simulation to view execution timeline.</p>}

          {simulation && (
            <>
              {!simulation.valid && simulation.errors.length > 0 && (
                <ul>
                  {simulation.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}

              {simulation.steps.length > 0 && (
                <ol className="wf-step-list">
                  {simulation.steps.map((step) => (
                    <li key={step.id} className={`wf-step ${step.status}`}>
                      <strong>{step.nodeType.toUpperCase()}</strong>
                      <span>{step.message}</span>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

